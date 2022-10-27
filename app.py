
from io import BytesIO
from flask import Flask,request,abort,render_template,jsonify,url_for,flash,send_file
from models import *

app = Flask(__name__)

app.config.from_object('config')

setuDb(app)
# delete_all_create_all()

@app.route('/')
def home():
        return render_template('pages/home.html',title='Home')


@app.route('/play/<int:id>')
def play_song(id):
    try:
        song = Song.query.filter(Song.id == id).one_or_none()
        next_song = Song.query.filter(Song.id == song.song_format()['id'] + 1).one_or_none()
        previous_song = Song.query.filter(Song.id == song.song_format()['id'] - 1).one_or_none()
        next_id = None
        previous_id = None
        if next_song:
            next_id = next_song.song_format()['id']
        else:
            next_id = id
        if previous_song:
            previous_id = previous_song.song_format()['id']
        else:
            previous_song = song.song_format()['id']
    except: 
        abort(400)
    return render_template('pages/home.html',title='Home',id=id,song_title=song.song_format()['title'],next=next_id,previous=previous_id)


@app.route('/add')
def render_upload_template():
    return render_template('pages/upload.html',title='Upload')


@app.route('/add-song',methods=['POST'])
def add_new_song():

    try:
        song_file = request.files['song-file']
        song_title = song_file.filename

        song = Song(file=song_file.read(),title=song_title)
        song.add_song()
    except:
        return jsonify({"success":False})

    return jsonify({"success":True})

@app.route('/list-all')
def render_all_songs():
   songs = [song.song_format() for song in Song.query.all()]
   return render_template('pages/list.html',title='All Songs',songs=songs)


@app.route('/get-song/<int:id>')
def get_song(id):
    try:
        song = Song.query.filter(Song.id == id).one_or_none()
    except:
        abort(404)
    return send_file(BytesIO(song.file),download_name=song.title,as_attachment=False)




@app.route('/song',methods=['POST'])
def get_next_song():
    req = request.get_json()
    id = int(req['id'])
    if req['next'] == True:
        song = Song.query.filter(Song.id == id + 1).one_or_none()
        if song:
            return jsonify({"id":song.song_format()['id']})
        else:
            songs = [song.song_format()['id'] for song in Song.query.all()]
            song = songs[0]
            return jsonify({"id":song})
    else:
        song = Song.query.filter(Song.id == id - 1).one_or_none()
        if song:
            return jsonify({"id":song.song_format()['id']})
        else:
            songs = [song.song_format() for song in Song.query.all()]
            song = songs[len(songs)-1]
            return jsonify({"id":song['id']})








