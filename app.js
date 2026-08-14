
const SUPABASE_URL = "https://ngcfpttpxxcqlnoerdhk.supabase.co/rest/v1/
const SUPABASE_KEY = "sb_publishable_Cf2Q5FxtJwb_ur_ynq6vYQ_FD9wv-P4";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const candidates = [
  {
    id: 1,
    position: "President",
    name: "Mr. Percy Oppong Acheampong"
  },
  {
    id: 2,
    position: "Vice President",
    name: "Miss Elizabeth Owusu Serwaah"
  },
  {
    id: 3,
    position: "Secretary",
    name: "Mr. Tweneboah Koduah Samuel"
  },
  {
    id: 4,
    position: "Financial Secretary",
    name: "Stella Kwarteng"
  },
  {
    id: 5,
    position: "Welfare Officer",
    name: "Miss Agyeiwaa Sarpong"
  },
  {
    id: 6,
    position: "Organizer 1",
    name: "Mr. Emmanuel Akwasi Nyarko"
  },
  {
    id: 7,
    position: "Organizer 2",
    name: "Miss Hilda Serwaah Amoateng"
  }
];

const form = document.getElementById("voteForm");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

candidates.forEach(candidate => {

  form.innerHTML += `
    <div class="candidate">

      <div class="position">
        ${candidate.position}
      </div>

      <div class="name">
        ${candidate.name}
      </div>

      <div class="choices">

        <div class="choice">
          <input
            type="radio"
            name="candidate-${candidate.id}"
            id="yes-${candidate.id}"
            value="YES">
          <label for="yes-${candidate.id}">
            YES
          </label>
        </div>

        <div class="choice">
          <input
            type="radio"
            name="candidate-${candidate.id}"
            id="no-${candidate.id}"
            value="NO">
          <label for="no-${candidate.id}">
            NO
          </label>
        </div>

      </div>

    </div>
  `;
});

form.addEventListener("change", () => {

  const complete = candidates.every(candidate =>
    document.querySelector(
      `input[name="candidate-${candidate.id}"]:checked`
    )
  );

  submitBtn.disabled = !complete;
});

async function getAnonymousUser() {

  const { data, error } =
    await client.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  return data.user;
}

submitBtn.addEventListener("click", async () => {

  submitBtn.disabled = true;
  message.textContent = "Submitting vote...";

  try {

    const user = await getAnonymousUser();

    const votes = candidates.map(candidate => {

      const selected =
        document.querySelector(
          `input[name="candidate-${candidate.id}"]:checked`
        ).value;

      return {
        candidate_id: candidate.id,
        vote: selected,
        voter_id: user.id,
        voter_code: user.id
      };

    });

    const { error } =
      await client
        .from("votes")
        .insert(votes);

    if (error) {
      throw error;
    }

    form.innerHTML = "";

    message.textContent =
      "✅ Your vote has been submitted successfully.";

    submitBtn.style.display = "none";

  } catch (error) {

    console.error(error);

    message.textContent =
      "❌ Your vote could not be submitted. Please try again.";

    submitBtn.disabled = false;
  }
});  border-radius: 14px;
  padding: 16px;
  margin: 14px 0;
}

.position {
  font-size: 13px;
  font-weight: bold;
  color: #155eef;
  text-transform: uppercase;
}

.name {
  font-size: 18px;
  font-weight: bold;
  margin: 7px 0 14px;
}

.choices {
  display: flex;
  gap: 10px;
}

.choice {
  flex: 1;
}

.choice input {
  display: none;
}

.choice label {
  display: block;
  text-align: center;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
}

.choice input:checked + label {
  background: #155eef;
  color: white;
  border-color: #155eef;
}

#submitBtn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 12px;
  background: #155eef;
  color: white;
  font-size: 16px;
  font-weight: bold;
}

#submitBtn:disabled {
  opacity: 0.5;
}

#message {
  margin-top: 15px;
  text-align: center;
  font-weight: bold;
}
