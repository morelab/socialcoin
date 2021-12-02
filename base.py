from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

engine = create_engine(os.environ.get('DATABASE_URL'), pool_size=10, max_overflow=20) # TODO: fix these numbers
Session = sessionmaker(bind=engine)

Base = declarative_base()
Base.metadata.create_all(engine)


def init_db():
    Base.metadata.create_all(bind=engine)
