try:
    import psycopg2
    print("psycopg2 is installed")
except ImportError:
    print("psycopg2 is NOT installed")

try:
    import sqlalchemy
    print("sqlalchemy is installed")
except ImportError:
    print("sqlalchemy is NOT installed")
