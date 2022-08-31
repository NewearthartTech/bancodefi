# compiling
./SmartPy.sh compile ./contracts/my_contract.py ./compilation

# tests
./SmartPy.sh test ./contracts/my_contract.py ./compilation

# deploy
./SmartPy.sh originate-contract --code ./compilation/my_contract_compiled/step_000_cont_0_contract.tz --storage ./compilation/my_contract_compiled/step_000_cont_0_storage.tz --rpc https://ghostnet.smartpy.io --private-key <edsk...>


##
Contract KT1NUqpgPim21yjvAFBTo3mF5H8BcaKq13Rg originated!!!