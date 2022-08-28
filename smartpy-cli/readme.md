# compiling
./SmartPy.sh compile ./contracts/my_contract.py ./compilation

# tests
./SmartPy.sh test ./contracts/my_contract.py ./compilation

# deploy
./SmartPy.sh originate-contract --code ~/smartpy-cli/compilation/my_contract/<...>_contract.tz --storage ./compilation/my_contract/<...>_storage.tz --rpc https://granadanet.smartpy.io --private-key <edsk...>