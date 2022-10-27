from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()

def setuDb(app):
    db.app = app
    db.init_app(app)

def delete_all_create_all():
    db.drop_all()
    db.create_all()


class Song(db.Model):
    def __repr__(self):
        return "<number: {0},title: {1}>".format(self.id,self.title)
    
    def add_song(self):
        db.session.add(self)
        db.session.commit()
    
    def remove_song(self):
        db.session.delete(self)
        db.session.commit()
    
    id = db.Column(db.Integer,primary_key=True)
    title = db.Column(db.String,nullable=False)
    file = db.Column(db.LargeBinary,nullable=False)

    def __init__(self,title,file):
        self.title = title
        self.file = file
    
    def song_format(self):
        return {"title":self.title,"id":self.id}


