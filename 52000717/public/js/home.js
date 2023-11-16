// setup time display the flash message
setTimeout(function () {
  var flashMessage = document.querySelector(".alert-success");
  if (flashMessage) {
    flashMessage.style.display = "none";
  }
}, 3000);

//hiển thị dialog xóa user
$(".delete").on("click", (event) => {
  var id = $(event.target).closest("tr").find("td:first-child").text();
  $(".dialog").css("display", "flex");
  deleteUser(id);
});

function deleteUser(id) {
  $("#confirm-delete").on("click", (event) => {
    fetch(`http://localhost:3000/delete/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          // Xử lý trường hợp thành công
          closeDialog();
          window.location.href = "/";
        } else {
          // Xử lý trường hợp lỗi
          response.json().then((data) => {
            // Hiển thị thông báo lỗi cho người dùng
            const div = document.createElement("div");
            div.classList.add("alert", "alert-success");
            div.textContent = data.error;
            $(".notify").append(div);
            window.location.href = "/";
          });
        }
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  });
}

function closeDialog() {
  document.querySelector(".dialog").style.display = "none";
}

//hiển thị dialog edit người dùng
$(".edit").on("click", (event) => {
  var id = $(event.target).closest("tr").find("td:first-child").text();
  $("#id").val(id);
  $("#user-dialog").css("display", "flex");
});

function closeDialogUpdate() {
  document.querySelector("#user-dialog").style.display = "none";
}

// chi tiết người dùng
$(".detail").on("click", (event) => {
  console.log("hi");
  var id = $(event.target).closest("tr").find("td:first-child").text();
  window.location.href = `/users/${id}`;
});

//phân trang
// Lấy tất cả các thẻ <a> trong phân trang
const paginationLinks = document.querySelectorAll(".pagination a");

// Thêm sự kiện "click" cho từng thẻ <a>
paginationLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

    // Xóa class "active" từ tất cả các thẻ <a>
    paginationLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Thêm class "active" vào thẻ <a> được nhấn
    this.classList.add("active");
    var page = this.textContent;
    window.location.href = `/${page}`;
  });
});
