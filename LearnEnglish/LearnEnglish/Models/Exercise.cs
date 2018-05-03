using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LearnEnglish.Models
{
    public class Exercise
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public byte[] FileArray { get; set; }
        public DateTime DateTime { get; set; }
        public string Comment { get; set; }
        public bool IsChecked { get; set; }
        public bool IsViewed { get; set; }
        public Mark[] MarkArray { get; set; }
    }

    public class Mark
    {
        public double Time { get; set; }
        public int Type { get; set; }
    }
}