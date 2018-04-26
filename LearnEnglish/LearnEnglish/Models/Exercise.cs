using System;
using MongoDB.Bson;

namespace LearnEnglish.Models
{
    public class Exercise
    {
        public ObjectId Id { get; set; }
        public byte[] FileArray { get; set; }
        public DateTime DateTime { get; set; }
        public string Comment { get; set; }
        public bool IsChecked { get; set; }
        public bool IsViewed { get; set; }
    }
}