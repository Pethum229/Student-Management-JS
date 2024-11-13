const SERVER = "http://localhost:3001/students";
const AUTH_KEY = "Bearer 1a|98721c1f-f2a3-4531-baae-8ec19e0bf5";

const tbody = document.querySelector("tbody");
const template = document.querySelector("template");
const dialog = document.getElementById("student-dialog");

// Show Student Dialog
document.getElementById("add-student").onclick = () => {
  document.getElementById("submitBtn").textContent = "Add Student";
  dialog.classList.remove("hidden");
};

async function fetchStudents() {
  tbody.innerHTML = "";
  let res = await fetch(SERVER, {
    headers: {
      Authorization: AUTH_KEY,
    },
  });
  res = await res.json();
  console.log(res);

  res.forEach((student) => {
    const clone = template.content.cloneNode(true);
    const td = clone.querySelectorAll("td");

    td[0].textContent = student.id;
    td[1].textContent = student.name;
    td[2].textContent = student.age;
    td[3].textContent = student.city;
    td[4].querySelector(".edit").onclick = () => {
      document.getElementById("name").value = student.name;
      document.getElementById("age").value = student.age;
      document.getElementById("city").value = student.city;
      document.getElementById("submitBtn").textContent = "Update";
      dialog.classList.remove("hidden");
      document.getElementById("submitBtn").setAttribute("data-id", student.id);
    };
    td[4].querySelector(".delete").onclick = async () => {
      if (!confirm("Are you sure")) {
        return;
      }

      let res = await fetch(`${SERVER}/${student.id}`, {
        method: "DELETE",
        headers: {
          Authorization: AUTH_KEY,
          "Content-Type": "application/json",
        },
      });
      fetchStudents();
    };

    tbody.appendChild(clone);
  });
}

fetchStudents();

//Save new student
async function saveStudent() {
  let lastId = tbody.lastElementChild.querySelector("td").textContent;

  const student = {
    id: parseInt(lastId) + 1,
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    city: document.getElementById("city").value,
  };

  let res = await fetch(SERVER, {
    method: "POST",
    headers: {
      Authorization: AUTH_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });
}

document.getElementById("student-form").onsubmit = (e) => {
  e.preventDefault();
  if (document.getElementById("submitBtn").textContent == "Add Student") {
    saveStudent();
    fetchStudents();
    dialog.classList.add("hidden");
    document.getElementById("student-form").reset();
  } else {
    updateStudent();
    fetchStudents();
    dialog.classList.add("hidden");
  }
};

//Edit Student

async function updateStudent() {
  const student = {
    id: parseInt(document.getElementById("submitBtn").getAttribute("data-id")),
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    city: document.getElementById("city").value,
  };

  let res = await fetch(`${SERVER}/${student.id}`, {
    method: "PUT",
    headers: {
      Authorization: AUTH_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });
}
