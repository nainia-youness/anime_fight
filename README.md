## Anime_fight
# Description
this is a nodejs rest api.
The goal is a website where you can choose two anime characters, 
and vote for which one in your opinion will win if they fight one another. 
You can also comment on the fight and like or dislike it.  
example: levi ackerman vs Monkey D. Luffy
# database
The data was scraped from a famous website called myanimelist.com.
I got from it over 100 characters, their names, some info about them and the url of their image.
here is the database model used:
![database ERD](https://github.com/nainia-youness/anime_fight/blob/main/database_ERD.png?raw=true?)
# teknologies
In this part, i will be listing some of the things i worked with in this project in order to keep track of where i am
now and the things i still need to work on in the future:
-respected a certain file structure (could be better of course)
-did some descent error management (did not create any custom errors)
-used morgan (a logging package for nodejs)
-respected as mutch as i can the restful best practices, specially when it comes to endpoints
-designed a mysql database
-did user authentication (sign in,sign out,sign up) using JWT and refresh tokens.
-stored the refresh tokens on a redis database
-encripted the passwords before adding them to the database using bcrypt with some salt
