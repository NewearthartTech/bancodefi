import smartpy as sp

class MyContract(sp.Contract):

  def __init__(self):
      self.init(sp.map(tkey = sp.TBytes, tvalue= sp.TRecord(
        secret1Hash = sp.TBytes,
      )))
      

# STEP 1 -Called by Alex - Alex creates a loan record with Secret 1
  @sp.entry_point
  def askForLoan(self, _contractId, _secret1Hash):    
    self.data[_contractId] = sp.record(
        secret1Hash = _secret1Hash,
    )

@sp.add_test(name = "MyContract")
def test():
  scenario = sp.test_scenario()
  contract = MyContract()

# A a compilation target (produces compiled code)
sp.add_compilation_target("my_contract_compiled", MyContract())