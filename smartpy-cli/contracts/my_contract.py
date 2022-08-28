import smartpy as sp

# loan status
state_created = 0
state_bobFunded = 1
state_movedToEscrow = 2
state_refundToBob = 3
state_refundToAlex = 4
state_returned = 5
state_defaulted = 6
state_released = 7
state_fortified = 8


class MyContract(sp.Contract):

    def __init__(self):
        self.init(sp.map(tkey=sp.TBytes, tvalue=sp.TRecord(
            status=sp.TNat,  # uses one of the const state_

            secret1Hash=sp.TBytes,
            secret2Hash=sp.TOption(sp.TBytes),

            preImage1=sp.TOption(sp.TBytes), #revealed secret1
            preImage2=sp.TOption(sp.TBytes), #revealed secret2

            loanAmount=sp.TMutez,
            loanInterest=sp.TMutez,
            lenderDeposit=sp.TMutez,

            alexWallet=sp.TAddress,
            bobsWallet=sp.TOption(sp.TAddress),

            lockedTill=sp.TTimestamp,
            reqTill=sp.TTimestamp,
            acceptTill=sp.TTimestamp,
            releaseTill=sp.TTimestamp,

        )))

    @sp.entry_point
    def test(self, contractId, secret1Hash: sp.TBytes):
        sp.verify(~ self.data.contains(contractId),
                  "contract already exists")
        loan = self.data[contractId]
        loan.secret1Hash=secret1Hash


    # STEP 1 -Called by Alex - Alex creates a loan record with Secret 1

    @sp.entry_point
    def askForLoan(self, contractId, secret1Hash, loanAmount, loanInterest, lockedTill):

        sp.verify(~ self.data.contains(contractId),
                  "contract already exists")

        sp.verify(loanAmount > sp.mutez(0), "amount must be > 0")
        sp.verify(lockedTill > sp.now, "timeLock time must be in the future")

        reqTill = sp.now.add_days(1)  # 1 day from now
        acceptTill = reqTill.add_days(1)  # //1 day from reqTill
        releaseTill = lockedTill.add_days(1)  # //1 day from _lockedTill

        self.data[contractId] = sp.record(
            status=state_created,

            secret1Hash=secret1Hash,
            secret2Hash=sp.none,

            preImage1= sp.none,
            preImage2=sp.none,

            loanAmount=loanAmount,
            loanInterest=loanInterest,
            lenderDeposit=loanAmount,

            alexWallet=sp.sender,
            bobsWallet=sp.none,

            lockedTill=lockedTill,
            reqTill=reqTill,
            acceptTill=acceptTill,
            releaseTill=releaseTill
        )

    # Step2- called by Bob - Bob is funding the loan

    @sp.entry_point
    def giveLoan(self, contractId, secret2Hash):

        sp.verify(self.data.contains(contractId),
                  "contract does not exist")
        loan = self.data[contractId]
        sp.verify(loan.status == state_created, "must be created state")
        sp.verify(sp.amount >= (loan.loanAmount+loan.lenderDeposit),
                  "not the correct amount")

        loan.secret2Hash = sp.some(secret2Hash)
        loan.bobsWallet =  sp.some(sp.sender)
        
        loan.status = state_bobFunded
        self.data[contractId] = loan

    #Called by Bob in case Alex has not withdrawn the loan.
    @sp.entry_point
    def noTakersForLoan(self, contractId):

        sp.verify(self.data.contains(contractId),
                  "contract does not exist")
        loan = self.data[contractId]
        sp.verify(loan.status == state_bobFunded,"must be state_bobFunded")
        sp.verify(loan.acceptTill > sp.now, "acceptTill not yet passed")

        loan.status = state_refundToBob
        self.data[contractId] = loan

        sp.send(loan.bobsWallet.open_some(),(loan.loanAmount+loan.lenderDeposit))

    # STEP3:  -Called by Alex - Bob has funded the Loan and Alex is accepting the loan
    #                Only Alex knows secret1 so we don't care who the message sender etc is
    #                Alex Should NOT call this method before she has ensured that she has access to Loan Funds
    @sp.entry_point
    def acceptLoan(self, contractId, preImage1):
        sp.verify(self.data.contains(contractId),
                  "contract does not exist")
        loan = self.data[contractId]
        sp.verify(loan.acceptTill > sp.now, "acceptTill has passed")
        sp.verify(loan.status == state_bobFunded,"must be state_bobFunded")

        sp.verify(loan.secret1Hash == sp.sha3((preImage1)), "hashLock hash does not match");

        loan.preImage1 = sp.some(preImage1)
        loan.status = state_movedToEscrow
        self.data[contractId] = loan
        
        sp.send(loan.alexWallet,loan.loanAmount)


    #STEP 4 :  Alex returns the loan
    @sp.entry_point
    def returnLoan(self, contractId):
        sp.verify(self.data.contains(contractId),
                  "contract does not exist")
        loan = self.data[contractId]
        sp.verify(loan.lockedTill > sp.now, "loanDefault: loan is in default")
        sp.verify(loan.status == state_movedToEscrow,"must be state_movedToEscrow")

        sp.verify(sp.amount >= loan.loanAmount,"not the correct amount")

        loan.status = state_returned
        self.data[contractId] = loan



    #STEP 4-1 :  Loan has defaulted. Called by ANYONE To wrap up the default
    @sp.entry_point
    def loanDefault(self, contractId):
        sp.verify(self.data.contains(contractId),
                  "contract does not exist")
        loan = self.data[contractId]
        sp.verify(sp.now > loan.lockedTill, "loanDefault: loan is not defaulted yet")
        sp.verify(loan.status == state_movedToEscrow,"must be state_movedToEscrow")

        loan.status = state_defaulted
        self.data[contractId] = loan

        sp.send(loan.bobsWallet.open_some(),loan.lenderDeposit)

    
  #STEP 5 :  Called by Bob to claim return amount by revealing secret 2
    @sp.entry_point
    def claimReturn(self, contractId, preImage2):
        sp.verify(self.data.contains(contractId),
                  "contract does not exist")
        loan = self.data[contractId]
        sp.verify(loan.status == state_returned,"must be state_movedToEscrow")

        sp.verify(loan.secret2Hash.open_some() == sp.sha3((preImage2)), "hashLock hash does not match");

        loan.status = state_released
        self.data[contractId] = loan

        sp.send(loan.bobsWallet.open_some(),(loan.lenderDeposit+ loan.lenderDeposit) )

    



@sp.add_test(name="MyContract")
def test():
    scenario = sp.test_scenario()
    contract = MyContract()
    scenario += contract

    alex = sp.test_account("Alice")
    bob = sp.test_account("Robert")

    loanAmount= sp.mutez(15)

    secret1= sp.bytes("0x8787387387387387387373")
    secret2= sp.bytes("0x2020930939309309830983")

    contractId= sp.bytes("0x2020930939309309830A83")

    contract.askForLoan(
      contractId =contractId,
      secret1Hash =sp.sha3(secret1),
      loanAmount= loanAmount,
      loanInterest=sp.mutez(2),
      lockedTill=sp.now.add_days(30)
      ).run(
        sender=alex
      )


    contract.giveLoan(
      contractId =contractId,
      secret2Hash =sp.sha3(secret2)
    ).run(
      sender = bob,
      amount = (loanAmount+loanAmount)
    )

    contract.acceptLoan(
      contractId =contractId,
      preImage1= secret1
    )

    contract.returnLoan(contractId
    ).run(
      sender = alex,
      amount = (loanAmount)
    )

    contract.claimReturn(
      contractId =contractId,
      preImage2= secret2
    )

    #sp.verify(sp.balance(alex.address) == (alexBalance +  loanAmount), "alex doesn't have the right money")

    #contract.test(contractId = contractId, secret1Hash = sp.sha3(secret1))


# A a compilation target (produces compiled code)
sp.add_compilation_target("my_contract_compiled", MyContract())
