# Node-Redis-Caching
*Less than 1ms* response times. Metrics for API responses with and without a Redis cache.  

The application uses a NodeJS + Express server which calls the Google Books API to fetch top 10 results for the user's query. For each query, if the results array is found in the Redis Cache, it is readily returned. If not, then it is cached for later use.  
Expiration time can be set in a real-world use case but here for testing we don't need it.

### Without Redis cache
![Without Redis Cache](screenshots/900ms.png)

### With Redis Cache (<=1ms response time)
![With Redis Cache](screenshots/0.449ms.png)

### Redis Server
Redis Server running on `Linux: Ubuntu 18.04 LTS`. The official Redis package works only on Linux and can work with a port on Windows.
![Redis Server](screenshots/redis-server.png)
