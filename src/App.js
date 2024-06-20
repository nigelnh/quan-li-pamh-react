import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "boxicons";
import "./App.css";

function App() {
  const [pams, setPams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPamIndex, setCurrentPamIndex] = useState(null);
  const [formData, setFormData] = useState({
    maPam: "",
    tenPam: "",
    nguoiTao: "",
    ngayTao: "",
    loaiSuKien: "",
    ngayBatDauBaoGia: "",
    ngayKetThucBaoGia: "",
    soLuongPhanHoi: "",
    trangThai: "",
  });
  const hanghoacanmua = [
    { item: "Bơ, phô mai", soLuong: "10,000 cái" },
    { item: "Thực phẩm khô, gia vị", soLuong: "10,000 cái" },
    { item: "Bàn đá, bàn gang", soLuong: "10,000 cái" },
    { item: "Gương kính", soLuong: "10,000 cái" },
    { item: "Thiết bị cân", soLuong: "10,000 cái" },
  ];
  const deNghiMua = [
    { maDNMS: "PR.2023.0000010", donVi: "GGG-NH Gogi Tô Hiệu" },
    { maDNMS: "PR.2023.0000009", donVi: "GGG-NH Gogi Nguyễn Chí Thanh" },
    { maDNMS: "PR.2023.0000008", donVi: "GGG-NH Sumo Nguyễn Phong Sắc" },
    { maDNMS: "PR.2023.0000007", donVi: "GGG-NH Sumo Nguyễn Thị Đình" },
    { maDNMS: "PR.2023.0000006", donVi: "GGG-Phòng kế hoạch và phát triển" },
  ];

  // limit items in one page
  const [currentPage, setCurrentPage] = useState(1);
  let [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const modal = document.getElementById("myModal");
    const createModal = document.getElementsByClassName("create-modal")[0];
    const deleteModal = document.getElementsByClassName("delete-modal")[0];
    const editModal = document.getElementsByClassName("edit-modal")[0];
    const multiplyModal = document.getElementsByClassName("multiply-modal")[0];
    const modalBtn = document.getElementsByClassName("tao-pam")[0];
    const errors = document.getElementsByClassName("thong-bao-loi");
    const trangIcon = document.querySelector(".trang-icon");
    const pamDisplay = document.querySelectorAll(".trang");
    const totalPamsElement = document.querySelector(".total-pam");
    const pageNum = document.querySelector(".so-trang-icon");
    const numPages = document.querySelectorAll(".page-num");
    const closeModal = document.querySelector(".close-pam-form");

    const openModal = () => {
      clearData();
      createModal.style.display = "block";
      deleteModal.style.display = "none";
      editModal.style.display = "none";
      multiplyModal.style.display = "none";
      modal.style.display = "block";
    };

    const closeBtnModal = () => {
      modal.style.display = "none";
      deleteModal.style.display = "block";
      multiplyModal.style.display = "block";
      modal.style.display = "none";
      Array.from(errors).forEach((error) => (error.style.display = "none"));

      setIsEditing(false);
      setCurrentPamIndex(null);
    };

    const pagesVisibility = (event) => {
      const isAnyTrangVisible = Array.from(pamDisplay).some(
        (trang) => trang.style.display === "block"
      );

      const isAnyPageVisible = Array.from(numPages).some(
        (page) => page.style.display === "block"
      );

      if (!trangIcon.contains(event.target) && isAnyTrangVisible) {
        pamDisplay.forEach((trang) => {
          trang.style.display = "none";
        });
      }

      if (!pageNum.contains(event.target) && isAnyPageVisible) {
        numPages.forEach((page) => {
          page.style.display = "none";
        });
      }
    };

    const createPam = () => {
      if (!isPamValid()) {
        return;
      }

      setPams((prevPams) => {
        const newPams = [...prevPams, formData];
        totalPamsElement.textContent = newPams.length;
        return newPams;
      });

      multiplyModal.style.display = "block";
      modal.style.display = "none";
    };

    const handleDeletePam = () => {
      if (isEditing && currentPamIndex !== null) {
        const updatedPams = [...pams];
        updatedPams.splice(currentPamIndex, 1);
        setPams(updatedPams);
        setIsEditing(false);
        setCurrentPamIndex(null);
        clearData();

        createModal.style.display = "block";
        modal.style.display = "none";
      }
    };

    const handleMultiplyModal = () => {
      if (isEditing && currentPamIndex !== null) {
        const pamToDuplicate = pams[currentPamIndex];
        const duplicatedPam = { ...pamToDuplicate };

        setPams((prevPams) => {
          const newPams = [...prevPams, duplicatedPam];
          createModal.style.display = "block";
        modal.style.display = "none";
        return newPams;
        });
      }
    };

    const handleEditChange = () => {
      if (isEditing) {
        const updatedPams = pams.map((pam, index) =>
          index === currentPamIndex ? formData : pam
        );
        setPams(updatedPams);
        setIsEditing(false);
        setCurrentPamIndex(null);
      }

      modal.style.display = "none";
    };

    const dropDownTrang = (event) => {
      if (event.target === trangIcon || trangIcon.contains(event.target)) {
        pamDisplay.forEach((trang) => {
          trang.style.display =
            trang.style.display === "block" ? "none" : "block";
        });
      } else {
        pamDisplay.forEach((trang) => {
          trang.style.display = "none";
        });
      }
    };

    const changeNumDropDown = (event) => {
      const option1 = document.getElementsByClassName("trang")[0];
      const option2 = document.getElementsByClassName("trang")[1];
      let numPams = document.getElementsByClassName("num-pams")[0];

      if (event.target === option1) {
        setItemsPerPage(10);
      } else if (event.target === option2) {
        setItemsPerPage(20);
      } else setItemsPerPage(30);

      paginationNumber();
      numPams.innerHTML = itemsPerPage;
    };

    const dropDownPage = (event) => {
      if (event.target === pageNum || pageNum.contains(event.target)) {
        numPages.forEach((page) => {
          page.style.display =
            page.style.display === "block" ? "none" : "block";
        });
      } else {
        numPages.forEach((page) => {
          page.style.display = "none";
        });
      }
    };

    modalBtn.addEventListener("click", openModal);
    window.addEventListener("click", pagesVisibility);
    createModal.addEventListener("click", createPam);
    deleteModal.addEventListener("click", handleDeletePam);
    editModal.addEventListener("click", handleEditChange);
    multiplyModal.addEventListener("click", handleMultiplyModal);
    trangIcon.addEventListener("click", dropDownTrang);
    pamDisplay.forEach((trang) => {
      trang.addEventListener("click", changeNumDropDown);
    });
    pageNum.addEventListener("click", dropDownPage);
    closeModal.addEventListener("click", closeBtnModal);

    return () => {
      modalBtn.removeEventListener("click", openModal);
      window.removeEventListener("click", pagesVisibility);
      createModal.removeEventListener("click", createPam);
      deleteModal.removeEventListener("click", handleDeletePam);
      editModal.removeEventListener("click", handleEditChange);
      multiplyModal.removeEventListener("click", handleMultiplyModal);
      trangIcon.removeEventListener("click", dropDownTrang);
      pamDisplay.forEach((trang) => {
        trang.removeEventListener("click", changeNumDropDown);
      });
      pageNum.removeEventListener("click", dropDownPage);
      closeModal.removeEventListener("click", closeBtnModal);
    };
  }, [formData, isEditing, currentPamIndex, pams]);

  // pam form configuration
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleEditClick = (index) => {
    const createModal = document.getElementsByClassName("create-modal")[0];
    const editModal = document.getElementsByClassName("edit-modal")[0];
    const deleteModal = document.getElementsByClassName("delete-modal")[0];
    createModal.style.display = "none";
    deleteModal.style.display = "block";
    editModal.style.display = "block";

    setCurrentPamIndex(index);
    setFormData(pams[index]);
    setIsEditing(true);

    const modal = document.getElementById("myModal");
    modal.style.display = "block";
  };

  const isValidDateFormat = (date) => {
    const [day, month, year] = date.split("-");
    if (!day || !month || !year || year.length < 4) return false;

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);

    if (isNaN(dayNum) || isNaN(monthNum)) return false;
    if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12)
      return false;

    return true;
  };

  const isPamValid = () => {
    const inputs = document.querySelectorAll(".pam-form input");
    let isValid = true;

    inputs.forEach((input, index) => {
      const errorDiv = document.getElementsByClassName("thong-bao-loi")[index];
      const inputName = input.getAttribute("id");
      const inputValue = input.value.trim();

      // Check if input is empty
      if (inputValue === "") {
        errorDiv.style.display = "block";
        isValid = false;
      } else {
        // Check date format for specific inputs
        if (
          (inputName === "ngayTao" ||
            inputName === "ngayKetThucBaoGia" ||
            inputName === "ngayBatDauBaoGia") &&
          !isValidDateFormat(inputValue)
        ) {
          errorDiv.style.display = "block";
          isValid = false;
        } else {
          errorDiv.style.display = "none";
        }
      }
    });

    return isValid;
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedPams = pams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  let totalPages = Math.ceil(pams.length / itemsPerPage);
  useEffect(() => {
    const next = document.querySelector(".sang-phai");
    const prev = document.querySelector(".sang-trai");
    let handleNextClick = () => handlePageChange(currentPage);
    let handlePrevClick = () => handlePageChange(currentPage);

    if (currentPage < totalPages && currentPage > 1) {
      handleNextClick = () => handlePageChange(currentPage + 1);
      handlePrevClick = () => handlePageChange(currentPage - 1);
    } else if (currentPage < totalPages)
      handleNextClick = () => handlePageChange(currentPage + 1);
    else if (currentPage > 1)
      handlePrevClick = () => handlePageChange(currentPage - 1);

    next.addEventListener("click", handleNextClick);
    prev.addEventListener("click", handlePrevClick);

    // Cleanup function to remove event listeners
    return () => {
      next.removeEventListener("click", handleNextClick);
      prev.removeEventListener("click", handlePrevClick);
    };
  }, [currentPage, totalPages]);

  // pagination page
  const paginationNumber = () => {
    // Reset pages array to an empty array
    const pages = [];

    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <div className="page-num" key={i} onClick={() => handlePageChange(i)}>
          {i}
        </div>
      );
    }

    return <div className="pagination-controls">{pages}</div>;
  };

  // clear data
  function clearData() {
    setFormData({
      maPam: "",
      tenPam: "",
      nguoiTao: "",
      ngayTao: "",
      loaiSuKien: "",
      ngayBatDauBaoGia: "",
      ngayKetThucBaoGia: "",
      soLuongPhanHoi: "",
      trangThai: "",
    });
  }

  return (
    <div>
      <div className="thanh-trang-thai">
        <box-icon name="wallet" color="#A9A9A9"></box-icon>
        <div className="eProcurement">eProcurement</div>
        <div className="split-icon">|</div>
        <div className="nav">Trang chủ</div>
        <div className="nav">
          <div>Kế hoạch</div>
          <box-icon name="chevron-down" color="#A9A9A9"></box-icon>
        </div>
        <div className="nav">Đề nghị mua</div>
        <Link to="/pam" className="nav nav-link">
          <div>Phương án mua</div>
          <box-icon name="chevron-down" color="#A9A9A9"></box-icon>
        </Link>
        <div className="nav">
          <div>Đơn hàng</div>
          <box-icon name="chevron-down" color="#A9A9A9"></box-icon>
        </div>
        <div className="nav">
          <div>Thanh toán</div>
          <box-icon name="chevron-down" color="#A9A9A9"></box-icon>
        </div>
        <div className="nav">Biểu mẫu</div>
        <div className="nav">Báo cáo</div>

        <div className="thong-bao">
          <box-icon className="bell" name="bell" color="#A9A9A9"></box-icon>
          <box-icon name="cog" color="#A9A9A9"></box-icon>
          <box-icon name="face" color="#ffffff"></box-icon>
          <box-icon type="solid" name="grid" color="#A9A9A9"></box-icon>
        </div>
      </div>

      <div className="tong-quan-container">
        <div className="tong-quan">Tổng quan</div>
        <div className="tong-quan-gach">/</div>
      </div>
      <div className="noi-dung">Quản lý phương án mua</div>

      <div className="container">
        <div className="hang-hoa-can-mua">
          <div className="tua-de">Hàng hoá cần mua</div>
          <div className="tua-de-des">
            Lựa chọn các hàng hoá đang có nhu cầu để mua tập trung
          </div>
          <input type="text" placeholder="Tìm kiếm" />
          <table className="bang-pam">
            <thead>
              <tr>
                <th className="vat-tu-hang-hoa">
                  <div className="hang-hoa">
                    <img
                      className="to-do"
                      src="images/square--outline.svg"
                      alt=""
                    />
                    Vật tư, hàng hoá
                  </div>
                </th>
                <th className="so-luong">Số lượng cần mua</th>
              </tr>
            </thead>
            <tbody>
              {hanghoacanmua.map((item, index) => (
                <tr className="list" key={index}>
                  <td className="loai-hang-hoa">
                    <img
                      className="to-do"
                      src="images/square--outline.svg"
                      alt=""
                    />
                    {item.item}
                  </td>
                  <td className="so-luong">{item.soLuong}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="de-nghi-mua">
          <div className="tua-de">Đề nghị mua</div>
          <div className="tua-de-des">Tạo PAM cho 1 đề nghị</div>
          <input type="text" placeholder="Tìm kiếm" />
          <table className="bang-pam">
            <thead>
              <tr>
                <th className="vat-tu-hang-hoa">
                  <div className="hang-hoa">Mã ĐNMS</div>
                </th>
                <th className="so-luong">Đơn vị</th>
              </tr>
            </thead>
            <tbody>
              {deNghiMua.map((item, index) => (
                <tr key={index}>
                  <td className="loai-hang-hoa">{item.maDNMS}</td>
                  <td className="so-luong">{item.donVi}</td>
                  <img
                    className="doc-add"
                    src="images/document--add.svg"
                    alt=""
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="plan">
        <div className="tua-de-container">
          <div className="tua-de">Danh sách phương án mua</div>
          <div className="tua-de-des">
            Danh sách các Phương án mua (PAM) được tạo ra trên hệ thống mà người
            dùng được phân quyền truy xuất
          </div>
          <div className="view">
            <div className="view-des">
              <img className="view-sym" src="images/view.svg" alt="" />
              View: View all
              <box-icon name="chevron-down" color="#0080FF"></box-icon>
            </div>
            <div className="right-setting">
              <box-icon name="search" color="#A9A9A9"></box-icon>
              <box-icon name="filter-alt"></box-icon>
              <div className="tao-pam">
                Tạo mới PAM
                <img className="add-sym" src="/images/add.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <table className="bang-pam">
        <thead>
          <tr className="thong-tin-loai-pam">
            <th className="loai-pam">Mã PAM #</th>
            <th className="loai-pam">Tên PAM</th>
            <th className="loai-pam">Người tạo</th>
            <th className="loai-pam">Ngày tạo</th>
            <th className="loai-pam">Loại sự kiện</th>
            <th className="loai-pam">Ngày bắt đầu báo giá</th>
            <th className="loai-pam">Ngày kết thúc báo giá</th>
            <th className="loai-pam">Số lượng phản hồi</th>
            <th className="loai-pam">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPams.map((pam, index) => (
            <tr className="thong-tin-pam" key={index}>
              <td className="loai">{pam.maPam}</td>
              <td className="loai">{pam.tenPam}</td>
              <td className="loai">{pam.nguoiTao}</td>
              <td className="loai">{pam.ngayTao}</td>
              <td className="loai">{pam.loaiSuKien}</td>
              <td className="loai">{pam.ngayBatDauBaoGia}</td>
              <td className="loai">{pam.ngayKetThucBaoGia}</td>
              <td className="loai">{pam.soLuongPhanHoi}</td>
              <td className="loai">{pam.trangThai}</td>
              <td className="edit">
                <box-icon
                  onClick={() => handleEditClick(index)}
                  name="dots-vertical-rounded"
                  size="xs"
                ></box-icon>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div id="myModal" className="modal">
        <div className="modal-content">
          <img className="close-pam-form" src="images/close.svg" alt="" />
          <form className="pam-form">
            <label htmlFor="maPam">Mã PAM:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[0].style.display = "none";
              }}
              type="text"
              id="maPam"
              value={formData.maPam}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Mã PAM chỉ được sử dụng "." và không có khoảng trống
            </div>

            <label htmlFor="tenPam">Tên PAM:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[1].style.display = "none";
              }}
              type="text"
              id="tenPam"
              value={formData.tenPam}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">* Tên PAM không được để trống</div>

            <label htmlFor="nguoiTao">Người tạo:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[2].style.display = "none";
              }}
              type="text"
              id="nguoiTao"
              value={formData.nguoiTao}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Tên người tạo không được để trống
            </div>

            <label htmlFor="ngayTao">Ngày tạo:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[3].style.display = "none";
              }}
              type="text"
              id="ngayTao"
              value={formData.ngayTao}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Ngày tạo phải theo định dạng DD-MM-YYYY
            </div>

            <label htmlFor="loaiSuKien">Loại sự kiện:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[4].style.display = "none";
              }}
              type="text"
              id="loaiSuKien"
              value={formData.loaiSuKien}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Loại sự kiện không được để trống
            </div>

            <label htmlFor="ngayBatDauBaoGia">Ngày bắt đầu báo giá:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[5].style.display = "none";
              }}
              type="text"
              id="ngayBatDauBaoGia"
              value={formData.ngayBatDauBaoGia}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Ngày bắt đầu phải theo định dạng DD-MM-YYYY
            </div>

            <label htmlFor="ngayKetThucBaoGia">Ngày kết thúc báo giá:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[6].style.display = "none";
              }}
              type="text"
              id="ngayKetThucBaoGia"
              value={formData.ngayKetThucBaoGia}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Ngày kết thúc phải theo định dạng DD-MM-YYYY
            </div>

            <label htmlFor="soLuongPhanHoi">Số lượng phản hồi:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[7].style.display = "none";
              }}
              type="text"
              id="soLuongPhanHoi"
              value={formData.soLuongPhanHoi}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Số lượng phản hồi không được để trống
            </div>

            <label htmlFor="trangThai">Trạng thái:</label>
            <input
              onClick={() => {
                document.getElementsByClassName(
                  "thong-bao-loi"
                )[8].style.display = "none";
              }}
              type="text"
              id="trangThai"
              value={formData.trangThai}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">
              * Trạng thái không được để trống
            </div>
          </form>

          <div className="create-delete-modal">
            <button className="edit-modal">Sửa PAM</button>
            <button className="create-modal">Tạo PAM</button>
            <button className="delete-modal">Xoá PAM</button>
            <button className="multiply-modal">Nhân bản PAM</button>
          </div>
        </div>
      </div>

      <div className="dieu-huong-container">
        <div className="dieu-huong-trai">
          <div className="so-luong-pam-hien">Số bản ghi mỗi trang:</div>
          <div className="trang-dropdown">
            <div className="trang-icon">
              <div className="num-pams">{itemsPerPage}</div>
              <box-icon name="chevron-down" color="black"></box-icon>
            </div>
            <div className="trang-container">
              <div className="trang" value="10">
                10
              </div>
              <div className="trang" value="20">
                20
              </div>
              <div className="trang" value="30">
                30
              </div>
            </div>
          </div>
          <div className="divider">|</div>
          <div className="tong-so-pam">
            {currentPage > 1 ? 1 + itemsPerPage : 1}-
            {itemsPerPage * currentPage} của
            <div className="total-pam">{pams.length}</div> bản ghi
          </div>
        </div>

        <div className="dieu-huong-phai">
          <div className="divider">|</div>
          <div className="so-trang-icon">
            <div className="so-trang">{currentPage}</div>
            <box-icon name="chevron-down" color="black"></box-icon>
          </div>
          <div className="tong-so-trang">của {totalPages} trang</div>
          <button className="sang-trai">{"<"}</button>
          <button className="sang-phai">{">"}</button>
        </div>
      </div>

      <div className="trang-list">{paginationNumber()}</div>
      {/* <table>
        <thead></thead>
      </table> */}
    </div>
  );
}

export default App;
