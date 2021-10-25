## Anime_fight
# Description
this is a nodejs rest api.
The goal is a website where you can choose two anime characters, 
and vote for which one in your opinion will win if they fight one another. 
You can also comment on the fight and like or dislike it.  
example: levi ackerman vs Monkey D. Luffy
# Database
The data was scraped from a famous website called myanimelist.com.
I got from it over 100 characters, their names, some info about them and the url of their image.
then created a combination of the characters (the fights).
Then inserted everything into the database.
here is the database model used:
![database ERD](https://github.com/nainia-youness/anime_fight/blob/main/database_ERD.png?raw=true?)
# Teknologies
In this part, i will be listing some of the things i worked with in this project in order to keep track of where i am
now and the things i still need to work on in the future:
* respected a certain file structure (could be better of course).
  * in the future i will respect the MVC design pattern and use some ORM.
* did some descent error management.
  * did not create any custom errors.
* respected as mutch as i can the restful best practices. Specially when it comes to endpoints.
* designed a mysql database.
* did user authentication (sign in,sign out,sign up) using JWT and refresh tokens.
  * did not create any custom errors.
* stored the refresh tokens on a redis database.
* encripted the passwords before adding them to the database using bcrypt with some salt.

# Installations
* npm clone https://github.com/nainia-youness/anime_fight.git
* import the mysql database
* install and create a redis database (if on windows, you will need to install wsl)
* start both mysql and redis servers
* cd \anime_fight\backend\src
* node server.js

# Endpoints

**Public**

  * GET: /api/characters/1 
    * get img and info of character with id=1

  * GET: /api/fights/0/comments
    * get all comments of fight with id=0

  * GET: /api/fights/0/characters/1/nbr_votes
    * get number of votes of the fight 0 and the character 1    

  * GET: /api/fights/0/nbr_dislikes

  * GET: /api/fights/0/nbr_likes

  * GET: /api/characters/0/1/fights
    * get id of the fight with char 0 and char 1

  * POST: /api/user/sign_in (body= email/password) 
    * user get his refresh and access token  

  * POST: /api/user/sign_up (body= email/password/username)

**Private** (you need to send your access token to access these routes)

  * POST: /api/fights/0/likes (body= islike:0 or 1)
    * the user like(1) or dislike(0) the fight with id 0

  * POST: /api/fights/0/comments (body= comment/ id_comment_responded_to:id_comment or null)
    * the user comments on the fight

  * DEL: /api/fights/comments/6

  * PUT: /api/fights/comments/6 (body= comment)

  * POST: /api/fights/1/votes (body= id_char_voted_for)
    * vote for char with id=id_char_voted_for

  * GET: /api/fights/0/characters/1/vote_state: 
    * get the state of vote of the user for the fight 0 character 1

  * GET: /api/fights/0/dislike_state

  * GET: /api/fights/0/like_state

  * POST: /api/user/token (body= refresh_token)
    * user sends his refresh token and asks for a new access token  

  * DEL: /api/user/sign_out

     

