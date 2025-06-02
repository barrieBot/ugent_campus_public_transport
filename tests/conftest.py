import pytest
from app import make_app

@pytest.fixture
def client():
    app = make_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

