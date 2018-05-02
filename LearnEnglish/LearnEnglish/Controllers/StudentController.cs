using System;
using MongoDB.Driver;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using LearnEnglish.Models;
using MongoDB.Bson;

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

        [HttpGet]
        [Route("Student/GetList")]
        public async Task<IHttpActionResult> GetList()
        {
            var projection = Builders<Exercise>.Projection.Expression(p => new Exercise
            {
                Id = p.Id,
                DateTime = p.DateTime,
                Comment = p.Comment,
                IsChecked = p.IsChecked,
                IsViewed = p.IsViewed
            } );
            var exerciseList = await _collection.Find(new BsonDocument()).Project(projection).ToListAsync();
            return Ok(exerciseList);
        }

        [HttpGet]
        [Route("Student/GetAudio/{id}")]
        public async Task<HttpResponseMessage> GetAudio(string id)
        {
            var exercise = await _collection.Find(new BsonDocument("_id", new ObjectId(id))).SingleOrDefaultAsync();
            if (exercise == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            var response = new HttpResponseMessage(HttpStatusCode.OK) {Content = new ByteArrayContent(exercise.FileArray)};
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") {FileName = $"{id}.webm"};
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("audio/webm");
            return response;
        }
    }
}
