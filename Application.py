from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import webbrowser
import mimetypes
import time
import json

file_map = {
    '/': 'home/index.html',
    '/home/style.css': 'home/style.css',
    '/home/script.js': 'home/script.js',
    '/icons/thegrowthcompass.png': 'icons/thegrowthcompass.png',
    '/icons/favicon.ico': 'icons/favicon.ico',
    '/favicon.ico': 'icons/favicon.ico',
    '/mbti-test/index.html': 'mbti-test/index.html',
    '/mbti-test/script.js': 'mbti-test/script.js',
    '/mbti-test/style.css': 'mbti-test/style.css',
    '/mbti-test/db/SN.txt': 'mbti-test/db/SN.txt',
    '/mbti-test/db/FT.txt': 'mbti-test/db/FT.txt',
    '/mbti-test/db/EI.txt': 'mbti-test/db/EI.txt',
    '/mbti-test/db/JP.txt': 'mbti-test/db/JP.txt',
    '/products/index.html': 'products/index.html',
    '/products/style.css': 'products/style.css',
    '/book-reader/index.html': 'book-reader/index.html',
    '/book-reader/script.js': 'book-reader/script.js',
    '/book-reader/style.css': 'book-reader/style.css',
    '/book-reader/db/books': 'book-reader/books',
    '/book-reader/books/Albert_Camus_The_Stranger.pdf': 'book-reader/books/Albert_Camus_The_Stranger.pdf',
    '/book-reader/books/Aleksandr_Solzhenitsyn_The_Gulag_Archipelago.pdf': 'book-reader/books/Aleksandr_Solzhenitsyn_The_Gulag_Archipelago.pdf',
    '/book-reader/books/Aldous_Huxley_Brave_New_World.pdf': 'book-reader/books/Aldous_Huxley_Brave_New_World.pdf',
    '/book-reader/books/Carl_Jung_The_Red_Book.pdf': 'book-reader/books/Carl_Jung_The_Red_Book.pdf',
    '/book-reader/books/Epictetus_Manual.pdf': 'book-reader/books/Epictetus_Manual.pdf',
    '/book-reader/books/Franz_Kafka_Dearest_Father.pdf': 'book-reader/books/Franz_Kafka_Dearest_Father.pdf',
    '/book-reader/books/Franz_Kafka_Metamorphosis.pdf': 'book-reader/books/Franz_Kafka_Metamorphosis.pdf',
    '/book-reader/books/Franz_Kafka_The_Trial.pdf': 'book-reader/books/Franz_Kafka_The_Trial.pdf',
    '/book-reader/books/Friedrich_Nietzsche_Thus_Spoke_Zarathustra.pdf': 'book-reader/books/Friedrich_Nietzsche_Thus_Spoke_Zarathustra.pdf',
    '/book-reader/books/Fyodor_Dostoyevsky_Notes_from_the_Underground.pdf': 'book-reader/books/Fyodor_Dostoyevsky_Notes_from_the_Underground.pdf',
    '/book-reader/books/Fyodor_Dostoyevsky_Crime_and_Punishment.pdf': 'book-reader/books/Fyodor_Dostoyevsky_Crime_and_Punishment.pdf',
    '/book-reader/books/Fyodor_Dostoyevsky_The_Brothers_Karamazov.pdf': 'book-reader/books/Fyodor_Dostoyevsky_The_Brothers_Karamazov.pdf',
    '/book-reader/books/Fyodor_Dostoyevsky_The_Double.pdf': 'book-reader/books/Fyodor_Dostoyevsky_The_Double.pdf',
    '/book-reader/books/George_Orwell_1984.pdf': 'book-reader/books/George_Orwell_1984.pdf',
    '/book-reader/books/George_Orwell_Animal_Farm.pdf': 'book-reader/books/George_Orwell_Animal_Farm.pdf',
    '/book-reader/books/George_Orwell_Burmese_Days.pdf': 'book-reader/books/George_Orwell_Burmese_Days.pdf',
    '/book-reader/books/George_Orwell_Homage_to_Catalonia.pdf': 'book-reader/books/George_Orwell_Homage_to_Catalonia.pdf',
    '/book-reader/books/George_S_Clason_Richest_Man_In_Babylon.pdf': 'book-reader/books/George_S_Clason_Richest_Man_In_Babylon.pdf',
    '/book-reader/books/James_Clear_Atomic_Habits.pdf': 'book-reader/books/James_Clear_Atomic_Habits.pdf',
    '/book-reader/books/Jean-Paul_Sartre_No_Exit.pdf': 'book-reader/books/Jean-Paul_Sartre_No_Exit.pdf',
    '/book-reader/books/Jordan_Peterson_12_More_Rules_For_Life.PDF': 'book-reader/books/Jordan_Peterson_12_More_Rules_For_Life.PDF',
    '/book-reader/books/Jordan_Peterson_12_Rules_For_Life.PDF': 'book-reader/books/Jordan_Peterson_12_Rules_For_Life.PDF',
    '/book-reader/books/Leo_Tolstoy_War_and_Peace.pdf': 'book-reader/books/Leo_Tolstoy_War_and_Peace.pdf',
    '/book-reader/books/Marcus_Aurelius_Meditations_Translated_Gregory_Hays.pdf': 'book-reader/books/Marcus_Aurelius_Meditations_Translated_Gregory_Hays.pdf',
    '/book-reader/books/Niccolo_Machiavelli_The_Prince.pdf': 'book-reader/books/Niccolo_Machiavelli_The_Prince.pdf',
    '/book-reader/books/Nicolae_Steinhardt_Diary_of_Happiness.pdf': 'book-reader/books/Nicolae_Steinhardt_Diary_of_Happiness.pdf',
    '/book-reader/books/Nicolae_Steinhardt_Jurnalul_Fericirii.pdf': 'book-reader/books/Nicolae_Steinhardt_Jurnalul_Fericirii.pdf',
    '/book-reader/books/Plato_The_Republic.pdf': 'book-reader/books/Plato_The_Republic.pdf',
    '/book-reader/books/Plato_The_Symposium.pdf': 'book-reader/books/Plato_The_Symposium.pdf',
    '/book-reader/books/Plato_The_Trial_and_Death_of_Socrates.pdf': 'book-reader/books/Plato_The_Trial_and_Death_of_Socrates.pdf',
    '/book-reader/books/Robert_Greene_Mastery.pdf': 'book-reader/books/Robert_Greene_Mastery.pdf',
    '/book-reader/books/Robert_Greene_The_48_Laws_of_Power.pdf': 'book-reader/books/Robert_Greene_The_48_Laws_of_Power.pdf',
    '/book-reader/books/Stephen_Mitford_A_History_of_Central_Banking_and_the_Enslavement_of_Mankind.pdf': 'book-reader/books/Stephen_Mitford_A_History_of_Central_Banking_and_the_Enslavement_of_Mankind.pdf',
    '/book-reader/books/Sun_Tzu_The_Art_Of_War.pdf': 'book-reader/books/Sun_Tzu_The_Art_Of_War.pdf',
    '/iq-test/index.html': 'iq-test/index.html',
    '/iq-test/script.js': 'iq-test/script.js',
    '/iq-test/style.css': 'iq-test/style.css',
    '/iq-test/questions.txt': 'iq-test/questions.txt',
    '/personality-types/index.html': 'personality-types/index.html',
    '/personality-types/style.css': 'personality-types/style.css',
    '/personality-types/E/N/F/J/index.html': 'personality-types/E/N/F/J/index.html',
    '/personality-types/E/N/F/J/style.css': 'personality-types/E/N/F/J/style.css',
    '/personality-types/E/N/F/P/index.html': 'personality-types/E/N/F/P/index.html',
    '/personality-types/E/N/F/P/style.css': 'personality-types/E/N/F/P/style.css',
    '/personality-types/E/N/T/J/index.html': 'personality-types/E/N/T/J/index.html',
    '/personality-types/E/N/T/J/style.css': 'personality-types/E/N/T/J/style.css',
    '/personality-types/E/N/T/P/index.html': 'personality-types/E/N/T/P/index.html',
    '/personality-types/E/N/T/P/style.css': 'personality-types/E/N/T/P/style.css',
    '/personality-types/E/S/F/J/index.html': 'personality-types/E/S/F/J/index.html',
    '/personality-types/E/S/F/J/style.css': 'personality-types/E/S/F/J/style.css',
    '/personality-types/E/S/F/P/index.html': 'personality-types/E/S/F/P/index.html',
    '/personality-types/E/S/F/P/style.css': 'personality-types/E/S/F/P/style.css',
    '/personality-types/E/S/T/J/index.html': 'personality-types/E/S/T/J/index.html',
    '/personality-types/E/S/T/J/style.css': 'personality-types/E/S/T/J/style.css',
    '/personality-types/E/S/T/P/index.html': 'personality-types/E/S/T/P/index.html',
    '/personality-types/E/S/T/P/style.css': 'personality-types/E/S/T/P/style.css',
    '/personality-types/I/N/F/J/index.html': 'personality-types/I/N/F/J/index.html',
    '/personality-types/I/N/F/J/style.css': 'personality-types/I/N/F/J/style.css',
    '/personality-types/I/N/F/P/index.html': 'personality-types/I/N/F/P/index.html',
    '/personality-types/I/N/F/P/style.css': 'personality-types/I/N/F/P/style.css',
    '/personality-types/I/N/T/J/index.html': 'personality-types/I/N/T/J/index.html',
    '/personality-types/I/N/T/J/style.css': 'personality-types/I/N/T/J/style.css',
    '/personality-types/I/N/T/P/index.html': 'personality-types/I/N/T/P/index.html',
    '/personality-types/I/N/T/P/style.css': 'personality-types/I/N/T/P/style.css',
    '/personality-types/I/S/F/J/index.html': 'personality-types/I/S/F/J/index.html',
    '/personality-types/I/S/F/J/style.css': 'personality-types/I/S/F/J/style.css',
    '/personality-types/I/S/F/P/index.html': 'personality-types/I/S/F/P/index.html',
    '/personality-types/I/S/F/P/style.css': 'personality-types/I/S/F/P/style.css',
    '/personality-types/I/S/T/J/index.html': 'personality-types/I/S/T/J/index.html',
    '/personality-types/I/S/T/J/style.css': 'personality-types/I/S/T/J/style.css',
    '/personality-types/I/S/T/P/index.html': 'personality-types/I/S/T/P/index.html',
    '/personality-types/I/S/T/P/style.css': 'personality-types/I/S/T/P/style.css',
    '/contact': 'https://www.instagram.com/sergiubatrin__/',
    '/about/index.html': 'about/index.html',
    '/about/style.css': 'about/style.css',
}

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/book-reader/books":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            books_dir = "book-reader/books"
            books = [f for f in os.listdir(books_dir) if f.endswith(".pdf")]
            self.wfile.write(json.dumps(books).encode("utf-8"))
        elif self.path in file_map:
            file_name = file_map[self.path]
            content_type = self.get_content_type(file_name)
            self.send_response(200)
            self.send_header('Content-type', content_type)
            self.end_headers()
            with open(file_name, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(b'Not Found')

    def get_content_type(self, file_name):
        # Ensure PDFs and JS files are served with the correct Content-Type
        if file_name.endswith('.pdf'):
            return 'application/pdf'
        elif file_name.endswith('.js'):
            return 'application/javascript'
        return mimetypes.guess_type(file_name)[0]

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, RequestHandler)
    print('Voila! The server is up and running on port 8000')
    url = 'http://localhost:8000'
    webbrowser.open(url)
    httpd.serve_forever()




run_server()