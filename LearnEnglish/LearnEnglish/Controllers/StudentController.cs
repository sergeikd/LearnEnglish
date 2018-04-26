using System;
using MongoDB.Driver;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using LearnEnglish.Models;

namespace LearnEnglish.Controllers
{
    public class StudentController : ApiController
    {
        private readonly IMongoCollection<Exercise> _collection;
        public StudentController()
        {
            const string connectionString = "mongodb://user:duplex@cluster0-shard-00-00-mn5ve.mongodb.net:27017,cluster0-shard-00-01-mn5ve.mongodb.net:27017,cluster0-shard-00-02-mn5ve.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
            _collection = new MongoClient(connectionString).GetDatabase("LearnEnglish").GetCollection<Exercise>("Exercise");
        }
        [HttpPost]
        [Route("Student/Upload")]
        public async Task<IHttpActionResult> Upload()
        {
            var formData = await Request.Content.ReadAsMultipartAsync();
            var content = formData.Contents.FirstOrDefault();
            if (content != null)
            {
                var exercise = new Exercise
                {
                    FileArray = await content.ReadAsByteArrayAsync(),
                    DateTime = DateTime.Now
                };
                await _collection.InsertOneAsync(exercise);
            }
            return Ok();
        }
    }
}
