from dotenv import dotenv_values
print(".env values:")
print(list(dotenv_values(".env").keys()))
print(".env.local values:")
print(list(dotenv_values(".env.local").keys()))
