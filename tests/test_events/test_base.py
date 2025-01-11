from unittest import TestCase
from fastapi.testclient import TestClient
from studsched.app.application import create_application


class TestBaseEventHandler(TestCase):
    def test_startup_handler(self):
        app = create_application()
        with self.assertLogs('studsched', level='INFO') as cm:

            with TestClient(app):
                pass
            self.assertEqual(cm.output,
                             ['INFO:studsched:Starting up ...',
                              'INFO:studsched:Shutting down ...'])
