
      let gorevListesi = [];

      if (localStorage.getItem("gorevListesi") !== null) {
        gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
      }
      let editId;
      let isEditTask = false;

      const taskInput = document.querySelector("#txtTaskName");
      const btnClear = document.querySelector("#btnClear");
      const filters = document.querySelectorAll(".filters span");

      displayTask(document.querySelector("span.active").id);

      function displayTask(filter) {
        ul = document.getElementById("task-list");
        ul.innerHTML = "";

        if (gorevListesi.length == 0) {
          ul.innerHTML = "<p class='p-3 m-0'> Görev Listeniz Boş. </p>";
        } else {
          for (let gorev of gorevListesi) {
            let tamamlandi = gorev.durum == "tamamlandı" ? "checked" : "";

            if (filter == gorev.durum || filter == "all") {
              let li = `
                <li class="task list-group-item">
                <div class="form-check">
                  <input type="checkbox" onclick="updateStatus(this)" id="${gorev.id}" class="form-check-input" ${tamamlandi}> 
                  <label for="${gorev.id}" class="form-check-label ${tamamlandi}"> ${gorev.gorevAdi}</label>
                 </div>
              <div class="dropdown">
                <button class="btn btn-link dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
                 <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash"></i> Sil </a></li> 
                  <li><a onclick='editTask(${gorev.id},"${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle </a></li>
                 </ul>
               </div>
              </li>
           `;
              ul.insertAdjacentHTML("beforeend", li);
            }
          }
        }
      }

      document
        .querySelector("#btnAddNewTask")
        .addEventListener("click", newTaskAdd);

      document
        .querySelector("#btnAddNewTask")
        .addEventListener("keyPress", newTaskAddWithEnter);

      function newTaskAddWithEnter(event) {
        if (event.key == "Enter") {
          document.getElementById("btnAddNewTask").click();
        }
      }

      for (let span of filters) {
        span.addEventListener("click", function () {
          document.querySelector("span.active").classList.remove("active");
          span.classList.add("active");
          displayTask(span.id);
        });
      }

      function newTaskAdd(event) {
        if (taskInput.value == "") {
          alert("görev adı girmelisiniz");
        } else {
          if (!isEditTask) {
            gorevListesi.push({
              id: gorevListesi.length + 1,
              gorevAdi: taskInput.value,
              durum: "beklemede",
            });
          } else {
            for (let gorev of gorevListesi) {
              if (gorev.id == editId) {
                gorev.gorevAdi = taskInput.value;
              }
              isEditTask = false;
            }
          }

          taskInput.value = "";
          displayTask(document.querySelector("span.active").id);
          localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        }

        event.preventDefault();
      }

      function deleteTask(id) {
        let deletedId;
        for (let index in gorevListesi) {
          if (gorevListesi[index].id == id) {
            deletedId = index;
          }
        }

        gorevListesi.splice(deletedId, 1);
        displayTask(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
      }

      function editTask(taskId, taskName) {
        editId = taskId;
        isEditTask = true;
        taskInput.value = taskName;
        taskInput.focus();
        taskInput.classList.add("active");
      }

      btnClear.addEventListener("click", function () {
        gorevListesi.splice(0, gorevListesi.length);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        displayTask();
      });

      function updateStatus(selectedTask) {
        let label = selectedTask.nextElementSibling;
        let durum;
        if (selectedTask.checked) {
          label.classList.add("tamamlandı");
          durum = "tamamlandı";
        } else {
          label.classList.remove("tamamlandı");
          durum = "beklemede";
        }
        for (gorev of gorevListesi) {
          if (gorev.id == selectedTask.id) {
            gorev.durum = durum;
          }
        }
        displayTask(document.querySelector("span.active").id);

        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
      }
    