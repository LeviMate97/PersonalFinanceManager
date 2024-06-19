using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Set the GOOGLE_APPLICATION_CREDENTIALS environment variable programmatically
var credentialPath = Path.Combine(Directory.GetCurrentDirectory(), "credentials", "personalfinancemanager-426212-283a9cf085a8.json");
Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

// Load configuration from appsettings.json and environment variables
builder.Configuration.SetBasePath(Directory.GetCurrentDirectory());
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddEnvironmentVariables();

// Initialize Firebase Admin SDK
try
{
    FirebaseApp.Create(new AppOptions()
    {
        Credential = GoogleCredential.GetApplicationDefault(),
    });

    // Register FirestoreDb as a singleton service
    string projectId = Environment.GetEnvironmentVariable("PROJECT_ID");
    builder.Services.AddSingleton(FirestoreDb.Create(projectId));
    Console.WriteLine("Firebase and Firestore initialized successfully.");

    if (Environment.GetEnvironmentVariable("ADD_TEST_DATA") == "true")
    {
        FirestoreDb db = FirestoreDb.Create(projectId);

        // Call the function to add test data
        await FirestoreTestData.AddTestData(db);
    }
}
catch (Exception ex)
{
    Console.WriteLine("Error initializing Firebase: " + ex.Message);
}

// Add services to the container
builder.Services.AddControllers();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder
            .WithOrigins("https://react-app-rruyak55aa-ew.a.run.app")
            .AllowAnyHeader()
            .AllowAnyMethod());
    // For debugging, allow all origins
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

// Get the port from environment variables or use a default value
var port = Environment.GetEnvironmentVariable("PORT") ?? "80";

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Use CORS
// Use "AllowAll" for debugging, revert to "AllowSpecificOrigin" for production
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Configure the application to listen on the specified port
app.Run($"http://*:{port}");
