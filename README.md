# Smooch Bot

A simple generic chat bot with persisted conversation state and user properties. You can also run your bot on top of [smooch.io](http://smooch.io).

A bot consists of three core components:

1. `Bot`: The heart of your bot. Your `Bot` implements a `say()` method. The bot also needs to be provided with a store implementation for saving conversation state and user properties, as well as a lock implemntation for synchronizing tasks.

1. `Script`: The chat script. This defines what your bot will say and how it should respond to user input.

1. `StateMachine`: This is the engine that uses the `Bot` to guide a session from one `Script` step to the next.

`SmoochApiBot` and `SmoochApiStore` allow you to run your chat bot on top of [smooch.io](http://smooch.io). That means you can run your bot over SMS, Web, iOS, Android, you name it! You can also hook your conversations up to back end channels such as Slack and HipChat so that a human jump in the conversation whenever you like.

To see this bot in action, check out the examples here: https://github.com/smooch/smooch-bot-example