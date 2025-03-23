
import redis.asyncio as redis

async def get_redis_connection() -> redis.Redis:
    '''
    Create a redis connection using the async redis-py
    '''
    return await redis.from_url("redis://localhost:6379", encoding='utf-8')
