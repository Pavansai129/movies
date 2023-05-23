const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

app = express();
app.listen(3000);
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("server running at 3000");
  } catch (error) {
    console.log(`DB error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbServer();

app.get("/movies/", async (request, response) => {
  const getMoviesQuarry = `select movie_name as movieName from movie;`;
  const moviesList = await db.all(getMoviesQuarry);
  response.send(moviesList);
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addDataQuarry = `INSERT INTO movie (director_id, movie_name, lead_actor) Values (${directorId}, "${movieName}", "${leadActor}");`;
  await db.run(addDataQuarry);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  console.log(movieId);
  const getMovieQuarry = `SELECT movie_id as movieID, director_id as directorId, movie_name as movieName, lead_actor as leadActor FROM movie;`;
  const movieDetails = await db.get(getMovieQuarry);
  console.log(movieDetails);
  response.send(movieDetails);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieDetailsQuarry = `UPDATE movie SET director_id = ${directorId}, movie_name = "${movieName}", lead_actor = "${leadActor}" WHERE movie_id = ${movieId};`;
  await db.run(updateMovieDetailsQuarry);
  response.send("Movie Successfully Added");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuarry = `DELETE FROM movie WHERE movie_id = ${movieId};`;
  await db.run(deleteMovieQuarry);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const getDirectorsQuarry = `SELECT director_id as directorId, director_name as directorName FROM director;`;
  const directorsList = await db.all(getDirectorsQuarry);
  response.send(directorsList);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesOfSpecificDirectors = `SELECT movie_name as movieName FROM movie LEFT JOIN director ON movie.director_id = director.director_id;`;
  const moviesOfSpecificDirectors = await db.all(getMoviesOfSpecificDirectors);
  response.send(moviesOfSpecificDirectors);
});
