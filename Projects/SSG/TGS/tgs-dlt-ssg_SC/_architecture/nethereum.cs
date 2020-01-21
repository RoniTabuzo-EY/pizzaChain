using System;
using System.IO;
using System.Threading.Tasks;
using Nethereum.Hex.HexTypes;
using Nethereum.Web3;
using Nethereum.Web3.Accounts;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace DLTSDK
{
    class Program
    {
        static void Main(string[] args)
        {
            Demo().Wait();
        }

        static async Task Demo()
        {
            try
            {
                // Setup
                var url = "https://abstgsdevezappmem01:Grantdemo123456!@abstgsdevezappmem01.blockchain.azure.com:3200";
                var privateKey = "0x23958bbe804899cfc3f95ef4792f154b9ef3729d";
                var account = new Account(privateKey);
                var web3 = new Web3(account, url);

                var json = JObject.Load(new JsonTextReader(new StreamReader(File.OpenRead("/Users/uy259bn/Projects/SSG/TGS/sdk/mysf/dltbridge/DLTBridge/SimpleStorage.json"))));
                var abi = json["abi"].ToString();
                var bytecode = json["bytecode"].ToString();

                var contractAddress = "0x417c3951E448F64c5779a4BE28FA25D9e2139daF";
                var contract = web3.Eth.GetContract(abi, contractAddress);


                Console.WriteLine("Sending a transaction to the function set()...");

                var setStorage = contract.GetFunction("set");

                //correct gas estimation with a parameter
                var estimatedGas = await setStorage.EstimateGasAsync(7);

                var receipt = await setStorage.SendTransactionAndWaitForReceiptAsync(account.Address, new HexBigInteger(estimatedGas.Value), null, null, 5);
                Console.WriteLine($"Finished storing an int : status : {receipt.Status.Value}");


                var getStorage = contract.GetFunction("get");
                var returnStorage = await getStorage.CallAsync<uint>();
                Console.WriteLine($"Finished retrieving an int: value : {returnStorage.ToString()}");

                //var getStorage = contract.GetFunction("get");
                //result = await getStorage.CallAsync<uint>();
                //Console.WriteLine($"result = {result} ");

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }

            Console.WriteLine("Finished");
            Console.ReadLine();
        }
    }
}
