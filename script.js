// // Tidy to auto-clean all these tensors
// tf.tidy(() => {
//   const users = ["Gant", "Todd", "Jed", "Justin"];
//   const bands = [
//     "Nirvana",
//     "Nine Inch Nails",
//     "Backstreet Boys",
//     "N Sync",
//     "Night Club",
//     "Apashe",
//     "STP",
//   ];
//   const features = [
//     "Grunge",
//     "Rock",
//     "Industrial",
//     "Boy Band",
//     "Dance",
//     "Techno",
//   ];

//   // User votes <4>
//   const user_votes = tf.tensor([
//     [10, 9, 1, 1, 8, 7, 8],
//     [6, 8, 2, 2, 0, 10, 0],
//     [0, 2, 10, 9, 3, 7, 0],
//     [7, 4, 2, 3, 6, 5, 5],
//   ]);

//   // Music Styles <5>
//   const band_feats = tf.tensor([
//     [1, 1, 0, 0, 0, 0],
//     [1, 0, 1, 0, 0, 0],
//     [0, 0, 0, 1, 1, 0],
//     [0, 0, 0, 1, 0, 0],
//     [0, 0, 1, 0, 0, 1],
//     [0, 0, 1, 0, 0, 1],
//     [1, 1, 0, 0, 0, 0],
//   ]);

//   // User's favorite styles
//   const user_feats = tf.matMul(user_votes, band_feats);
//   // Print the answers
//   user_feats.print();

//   // Let's make them pretty
//   const top_user_features = tf.topk(user_feats, features.length);
//   // Back to JavaScript
//   const top_genres = top_user_features.indices.arraySync();
//   // print the results
//   users.map((u, i) => {
//     const rankedCategories = top_genres[i].map((v) => features[v]);
//     console.log(u, rankedCategories);
//   });
// });
function getForm() {
  const form = document.getElementById("form");

  const groupsMusicals = [
    "One OK Rock",
    "Stray Kids",
    "Twenty One Pilots",
    "Imagine Dragons",
    "Soda Stereo",
    "Los Piojos",
    "The Beatles",
  ];

  const htmlContent = groupsMusicals
    .map(
      (group, index) =>
        `<div class='col'>${group}</div><div class='col'><input type='number' id='rating${index}' value='' min='0' max='10'/></div>`
    )
    .join("");
  // Insertar el contenido en el formulario
  form.innerHTML = htmlContent;
}

function processInformation() {
  const groupsMusicals = [
    "One OK Rock",
    "Stray Kids",
    "Twenty One Pilots",
    "Imagine Dragons",
    "Soda Stereo",
    "Los Piojos",
    "The Beatles",
  ];
  const genereMusicals = [
    "Rock",
    "K-pop",
    "Hip-Hop",
    "Pop",
    "ElectroPop",
    "Rock And Roll",
  ];

  const ratings = groupsMusicals.map((group, index) =>
    parseFloat(document.getElementById(`rating${index}`).value)
  );

  const band_feats = tf.tensor([
    [1, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0],
  ]);

  const ratingsTensor = tf.tensor(ratings).expandDims(0);
  const user_feats = tf.matMul(
    band_feats.transpose(),
    ratingsTensor.transpose()
  );

  const topGenreIndex = tf.argMax(user_feats, 1).dataSync()[0];

  // Limpia la salida anterior
  const rankingContainer = document.getElementById("ranking");
  rankingContainer.innerHTML = "";

  // Muestra el género musical preferido
  const preferredGenre = genereMusicals[topGenreIndex];
  const genreLabel = document.createElement("p");
  genreLabel.textContent = `Tu género musical preferido es: ${preferredGenre}`;
  rankingContainer.appendChild(genreLabel);

  // Muestra el ranking
  const sortedGroups = [...groupsMusicals].sort(
    (a, b) =>
      ratings[groupsMusicals.indexOf(b)] - ratings[groupsMusicals.indexOf(a)]
  );
  const rankedList = document.createElement("ol");
  sortedGroups.forEach((group) => {
    const listItem = document.createElement("li");
    listItem.textContent = group;
    rankedList.appendChild(listItem);
  });
  rankingContainer.appendChild(rankedList);
}

getForm();
