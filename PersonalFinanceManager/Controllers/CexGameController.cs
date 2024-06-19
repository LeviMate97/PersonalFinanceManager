using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebScrapingApi.Controllers
{
    public class CexGame
    {
        public string Name { get; set; }
        public string Platform { get; set; }
        public string ImageUrl { get; set; }
        public string Price { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class CexGameController : ControllerBase
    {
        [HttpGet("scrape")]
        public async Task<ActionResult<IEnumerable<CexGame>>> Scrape([FromQuery] string searchValue)
        {
            var products = await Task.Run(() => GetPageSource(searchValue));
            if (products == null || products.Count == 0)
            {
                return NotFound("No products found");
            }
            return Ok(products);
        }

        public static List<CexGame> GetPageSource(string searchValue)
        {
            var options = new FirefoxOptions();
            options.AddArgument("--headless");
            options.AddArgument("--no-sandbox");
            options.AddArgument("--disable-dev-shm-usage");

            // Make sure to provide the correct path to geckodriver
            FirefoxDriverService service = FirefoxDriverService.CreateDefaultService();
            service.HostName = "localhost";
            service.HideCommandPromptWindow = true;
            service.SuppressInitialDiagnosticInformation = true;

            using (IWebDriver driver = new FirefoxDriver(service, options))
            {
                try
                {
                    var url = "https://nl.webuy.com/search?stext=" + searchValue.Replace(" ", "+");
                    driver.Navigate().GoToUrl(url);

                    // Use WebDriverWait to wait until the search results are loaded
                    WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
                    wait.Until(d => d.FindElements(By.XPath("//div[contains(@class, 'search-product-card')]")).Count > 0);

                    string pageSource = driver.PageSource;

                    var doc = new HtmlDocument();
                    doc.LoadHtml(pageSource);

                    var productNodes = doc.DocumentNode.SelectNodes("//div[contains(@class, 'search-product-card')]");

                    if (productNodes == null) return new List<CexGame>();

                    List<CexGame> products = new List<CexGame>();

                    foreach (var node in productNodes)
                    {
                        var nameNode = node.SelectSingleNode(".//div[@class='card-title']/a");
                        var imageNode = node.SelectSingleNode(".//div[contains(@class, 'card-img')]/a/img");
                        var priceNode = node.SelectSingleNode(".//p[contains(@class, 'product-main-price')]");

                        string[] segments = imageNode.GetAttributeValue("src", string.Empty).Split('/');

                        var platform = segments[5];

                        if (nameNode != null && imageNode != null && priceNode != null)
                        {
                            var product = new CexGame
                            {
                                Name = nameNode.InnerText.Trim(),
                                Platform = platform,
                                ImageUrl = imageNode.GetAttributeValue("src", string.Empty),
                                Price = priceNode.InnerText.Trim()
                            };

                            products.Add(product);
                        }
                    }

                    return products;
                }
                finally
                {
                    driver.Quit();
                }
            }
        }
    }
}
