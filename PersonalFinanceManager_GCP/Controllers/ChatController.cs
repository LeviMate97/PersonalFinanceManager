using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;

namespace ChatBotApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private static readonly HttpClient client = new HttpClient();

        public ChatController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public class ChatMessage
        {
            public string Sender { get; set; }
            public string Text { get; set; }
        }

        public class ChatRequest
        {
            public List<ChatMessage> Messages { get; set; }
        }

        [HttpPost]
        public async Task<string> Post([FromBody] ChatRequest request)
        {
            var apiKey = Environment.GetEnvironmentVariable("OPENAI_APIKEY");
            var apiUrl = "https://api.openai.com/v1/chat/completions";

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var messages = new List<object>
                {
                    new { role = "system", content = "You are a smart personal finance and budgeting advisor." }
                };

                foreach (var message in request.Messages)
                {
                    var role = message.Sender == "user" ? "user" : "assistant";
                    messages.Add(new { role, content = message.Text });
                }

                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = messages,
                    max_tokens = 1000
                };

                var jsonRequestBody = JsonConvert.SerializeObject(requestBody);
                var content = new StringContent(jsonRequestBody, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(apiUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                var responseJson = JsonConvert.DeserializeObject<dynamic>(responseString);

                return responseJson.choices[0].message.content.ToString();
            }
        }
    }
}
