import asyncio
import logging
from typing import Iterable, Optional

from redis import asyncio as aioredis

from ..configs import get_settings
from .models.models import Channel, Message, MessageBase, UserBase

settings = get_settings()
logger = logging.getLogger(settings.PROJECT_SLUG)


class RedisChatService:
    def __init__(self, url: str):
        self.redis = aioredis.from_url(
            url, decode_responses=True, encoding="utf-8"
        )
        self.last_msg: dict[str, str] = dict()

    def close(self):
        asyncio.create_task(self.redis.close())
        asyncio.create_task(self.redis.connection_pool.disconnect())

    async def get_channels(self) -> Iterable[Channel]:
        channels = await self.redis.hgetall(":channels")
        return (
            Channel(slug=slug, name=name) for slug, name in channels.items()
        )

    async def get_channel(self, slug: str) -> Optional[Channel]:
        name = await self.redis.hget(":channels", slug)
        if not name:
            return None
        return Channel(name=name, slug=slug)

    async def create_channel(self, slug: str, name: str) -> Channel:
        await self.redis.hset(":channels", mapping={slug: name})
        return Channel(name=name, slug=slug)

    async def get_messages(self, channel_slug: str) -> list[Message]:
        redis_stream: str = f":channel-{channel_slug}:messages"
        messages: list[Message] = []
        last_msg = "0-0"
        while resp := dict(
            await self.redis.xread(
                {redis_stream: last_msg}, count=5, block=None
            )
        ):
            for last_msg, message_serialized in dict(resp)[redis_stream]:
                messages += [Message.parse_raw(message_serialized["data"])]
        return messages

    async def send_message(
        self, channel_slug: str, user: UserBase, message_base: MessageBase
    ) -> Message:
        message = Message(
            **message_base.dict(),
            sender_username=user.username,
            channel_slug=channel_slug,
        )
        await self.redis.xadd(
            f":channel-{channel_slug}:messages",
            id="*",
            fields={"data": message.json()},
        )
        return message

    async def incoming_messages(
        self,
        channel_slug: str,
        read_timeout: Optional[float] = None,
        only_new: bool = False,
    ):
        redis_channel = f":channel-{channel_slug}:messages"
        block_time = None
        self.last_msg.setdefault(redis_channel, "0-0")
        if read_timeout is not None:
            block_time = read_timeout * 1000
        while True:
            if messages := await self.redis.xread(
                {redis_channel: self.last_msg[redis_channel]},
                count=1,
                block=block_time,
            ):
                self.last_msg[redis_channel], message_serialized = dict(
                    messages
                )[redis_channel][0]
                message = Message.parse_raw(message_serialized["data"])
                yield message
            else:
                yield ...


def create_chat_service(url: str):
    return RedisChatService(url)
