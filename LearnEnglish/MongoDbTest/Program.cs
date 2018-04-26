using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MongoDbTest
{
    class Program
    {
        static void Main(string[] args)
        {
            SaveDocs().GetAwaiter().GetResult(); ;
        }
        private static async Task SaveDocs()
        {
            string connectionString = "mongodb://user:duplex@cluster0-shard-00-00-mn5ve.mongodb.net:27017,cluster0-shard-00-01-mn5ve.mongodb.net:27017,cluster0-shard-00-02-mn5ve.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
            MongoClient client = new MongoClient(connectionString);
            var database = client.GetDatabase("LearnEnglish");
            var collection = database.GetCollection<BsonDocument>("Task");
            IGridFSBucket gridFS = new GridFSBucket(database);
            using (Stream fs = new FileStream("C:\\Users\\s2.kudryavtsev\\Downloads\\file.webm", FileMode.Open))
            {
                ObjectId id = await gridFS.UploadFromStreamAsync("file.webm", fs);
                Console.WriteLine("id файла: {0}", id.ToString());
            }
            //await collection.InsertManyAsync(new[] { task1 });
        }
    }
}
