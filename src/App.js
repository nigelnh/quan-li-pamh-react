import React, { useState, useEffect } from "react";
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

  // limit items in one page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const modal = document.getElementById("myModal");
    const createModal = document.getElementsByClassName("create-modal")[0];
    const deleteModal = document.getElementsByClassName("delete-modal")[0];
    const editModal = document.getElementsByClassName("edit-modal")[0];
    const multiplyModal =
      document.getElementsByClassName("multiply-modal")[[0]];
    const modalBtn = document.getElementsByClassName("tao-pam")[0];
    const errors = document.getElementsByClassName("thong-bao-loi");

    const openModal = () => {
      clearData();
      deleteModal.style.display = "none";
      editModal.style.display = "none";
      multiplyModal.style.display = "none";
      modal.style.display = "block";
    };

    const handleClickOutside = (event) => {
      if (event.target === modal) {
        deleteModal.style.display = "block";
        createModal.style.display = "block";
        multiplyModal.style.display = "block";
        modal.style.display = "none";
        Array.from(errors).forEach((error) => (error.style.display = "none"));
        setIsEditing(false);
        setCurrentPamIndex(null);
      }
    };

    const createPam = () => {
      if (!validateForm()) return;

      // if (isEditing) {
      //   const updatedPams = pams.map((pam, index) =>
      //     index === currentPamIndex ? formData : pam
      //   );
      //   setPams(updatedPams);
      //   setIsEditing(false);
      //   setCurrentPamIndex(null);
      // } else {
      setPams((prevPams) => [...prevPams, formData]);
      // }

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
      if (!validateForm()) return;

      if (isEditing && currentPamIndex !== null) {
        const pamToDuplicate = pams[currentPamIndex];
        const duplicatedPam = { ...pamToDuplicate };

        setPams((prevPams) => [...prevPams, duplicatedPam]);

        createModal.style.display = "block";
        modal.style.display = "none";
      }
    };

    const handleEditChange = () => {
      if (!validateForm()) return;

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

    modalBtn.addEventListener("click", openModal);
    window.addEventListener("click", handleClickOutside);
    createModal.addEventListener("click", createPam);
    deleteModal.addEventListener("click", handleDeletePam);
    editModal.addEventListener("click", handleEditChange);
    multiplyModal.addEventListener("click", handleMultiplyModal);

    return () => {
      modalBtn.removeEventListener("click", openModal);
      window.removeEventListener("click", handleClickOutside);
      createModal.removeEventListener("click", createPam);
      deleteModal.removeEventListener("click", handleDeletePam);
      editModal.removeEventListener("click", handleEditChange);
      multiplyModal.removeEventListener("click", handleMultiplyModal);
    };
  }, [formData, isEditing, currentPamIndex, pams]);

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

  const isMaPamValid = (maPam) => {
    return maPam.includes(".") && !maPam.includes(" ");
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

  const validateForm = () => {
    let isValid = true;

    if (!isMaPamValid(formData.maPam)) {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[0].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[0].style.display =
        "none";
    }

    if (formData.tenPam === "") {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[1].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[1].style.display =
        "none";
    }

    if (formData.nguoiTao === "") {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[2].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[2].style.display =
        "none";
    }

    if (!isValidDateFormat(formData.ngayTao)) {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[3].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[3].style.display =
        "none";
    }

    if (formData.loaiSuKien === "") {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[4].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[4].style.display =
        "none";
    }

    if (!isValidDateFormat(formData.ngayBatDauBaoGia)) {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[5].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[5].style.display =
        "none";
    }

    if (!isValidDateFormat(formData.ngayKetThucBaoGia)) {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[6].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[6].style.display =
        "none";
    }

    if (formData.soLuongPhanHoi === "") {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[7].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[7].style.display =
        "none";
    }

    if (formData.trangThai === "") {
      isValid = false;
      document.getElementsByClassName("thong-bao-loi")[8].style.display =
        "block";
    } else {
      document.getElementsByClassName("thong-bao-loi")[8].style.display =
        "none";
    }

    return isValid ? true : false;
  };

  // Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedPams = pams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(pams.length / itemsPerPage);

  const renderPaginationControls = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          className="page-btns"
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={i === currentPage}
        >
          {i}
        </button>
      );
    }

    return <div className="pagination-controls">{pages}</div>;
  };

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
        <div className="nav">
          <div>Phương án mua</div>
          <box-icon name="chevron-down" color="#A9A9A9"></box-icon>
        </div>
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
          <div className="thong-tin">
            <div className="loai-hang-hoa">
              <div className="hang-hoa">
                <img
                  className="to-do"
                  src="images/square--outline.svg"
                  alt=""
                />
                <div className="loai">Vật tư, hàng hoá</div>
              </div>
              <div className="hang-hoa">
                <img
                  className="to-do"
                  src="images/square--outline.svg"
                  alt=""
                />
                <div>Bơ, phô mai</div>
              </div>
              <div className="hang-hoa">
                <img
                  className="to-do"
                  src="images/square--outline.svg"
                  alt=""
                />
                <div>Thực phẩm khô, gia vị</div>
              </div>
              <div className="hang-hoa">
                <img
                  className="to-do"
                  src="images/square--outline.svg"
                  alt=""
                />
                <div>Bàn đá, bàn gang</div>
              </div>
              <div className="hang-hoa">
                <img
                  className="to-do"
                  src="images/square--outline.svg"
                  alt=""
                />
                <div>Gương kính</div>
              </div>
              <div className="hang-hoa">
                <img
                  className="to-do"
                  src="images/square--outline.svg"
                  alt=""
                />
                <div>Thiết bị cân</div>
              </div>
            </div>
            <div className="so-luong">
              <div className="hang-hoa">
                <div className="loai">Số lượng cần mua</div>
              </div>
              <div className="hang-hoa">
                <div>10,000 cái</div>
              </div>
              <div className="hang-hoa">
                <div>10,000 cái</div>
              </div>
              <div className="hang-hoa">
                <div>10,000 cái</div>
              </div>
              <div className="hang-hoa">
                <div>10,000 cái</div>
              </div>
              <div className="hang-hoa">
                <div>10,000 cái</div>
              </div>
            </div>
          </div>
        </div>
        <div className="de-nghi-mua">
          <div className="tua-de">Đề nghị mua</div>
          <div className="tua-de-des">Tạo PAM cho 1 đề nghị</div>
          <input type="text" placeholder="Tìm kiếm" />
          <div className="thong-tin">
            <div className="loai-hang-hoa">
              <div className="hang-hoa">
                <div className="loai">Mã ĐNMS</div>
              </div>
              <div className="hang-hoa">
                <div className="num">PR.2023.0000010</div>
              </div>
              <div className="hang-hoa">
                <div className="num">PR.2023.0000009</div>
              </div>
              <div className="hang-hoa">
                <div className="num">PR.2023.0000008</div>
              </div>
              <div className="hang-hoa">
                <div className="num">PR.2023.0000008</div>
              </div>
              <div className="hang-hoa">
                <div className="num">PR.2023.0000008</div>
              </div>
            </div>
            <div className="so-luong">
              <div className="hang-hoa">
                <div className="loai">Đơn vị</div>
              </div>
              <div className="hang-hoa">
                <div>GGG-NH Tô Hiệu</div>
                <img
                  className="doc-add"
                  src="images/document--add.svg"
                  alt=""
                />
              </div>
              <div className="hang-hoa">
                <div>GGG-NH Tô Hiệu</div>
                <img
                  className="doc-add"
                  src="images/document--add.svg"
                  alt=""
                />
              </div>
              <div className="hang-hoa">
                <div>GGG-NH Tô Hiệu</div>
                <img
                  className="doc-add"
                  src="images/document--add.svg"
                  alt=""
                />
              </div>
              <div className="hang-hoa">
                <div>GGG-NH Tô Hiệu</div>
                <img
                  className="doc-add"
                  src="images/document--add.svg"
                  alt=""
                />
              </div>
              <div className="hang-hoa">
                <div>GGG-NH Tô Hiệu</div>
                <img
                  className="doc-add"
                  src="images/document--add.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
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

      <div className="thong-tin-plan">
        <div className="thong-tin-pam">
          <div className="ma-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Mã PAM #</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Tên PAM</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Người tạo</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Ngày tạo</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Loại sự kiện</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Ngày bắt đầu báo giá</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Ngày kết thúc báo giá</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Số lượng phản hồi</div>
            </div>
          </div>
        </div>
        <div className="thong-tin-pam">
          <div className="ten-pam">
            <div className="so-pam-title">
              <div className="loai-pam">Trạng thái</div>
            </div>
            {/* <div className="so-pam">
                 <div className="progress-container">
                   <img
                     className="progress-bar"
                     src="/images/queued.svg"
                     alt=""
                   />
                   <div className="num">Mới tạo</div>
                   <box-icon name="dots-vertical-rounded" size="xs"></box-icon>
                 </div>
               </div> */}
            {/* <div className="so-pam">
                 <div className="progress-container">
                   <img
                     className="progress-bar"
                     src="/images/in-progress.svg"
                     alt=""
                   />
                   <div className="num">Chờ duyệt sự liện</div>
                   <box-icon name="dots-vertical-rounded" size="xs"></box-icon>
                 </div>
               </div>
               <div className="so-pam">
                 <div className="progress-container">
                   <img
                     className="progress-bar"
                     src="/images/condition--wait-point.svg"
                     alt=""
                   />
                   <div className="num">Chờ diễn ra</div>
                   <box-icon name="dots-vertical-rounded" size="xs"></box-icon>
                 </div>
               </div>
               <div className="so-pam">
                 <div className="progress-container">
                   <img
                     className="progress-bar"
                     src="/images/error--outline.svg"
                     alt=""
                   />
                   <div className="num">Đã huỷ</div>
                   <box-icon name="dots-vertical-rounded" size="xs"></box-icon>
                 </div>
               </div> */}
          </div>
        </div>
      </div>
      
      <div className="danh-sach-pams">
        {paginatedPams.map((pam, index) => (
          <div className="thong-tin-pam" key={index}>
            <div className="hang-hoa">
              <div className="loai">{pam.maPam}</div>
              <div className="loai">{pam.tenPam}</div>
              <div className="loai">{pam.nguoiTao}</div>
              <div className="loai">{pam.ngayTao}</div>
              <div className="loai">{pam.loaiSuKien}</div>
              <div className="loai">{pam.ngayBatDauBaoGia}</div>
              <div className="loai">{pam.ngayKetThucBaoGia}</div>
              <div className="loai">{pam.soLuongPhanHoi}</div>
              <div className="loai">{pam.trangThai}</div>
              <div className="edit">
                <box-icon
                  onClick={() => handleEditClick(index)}
                  name="dots-vertical-rounded"
                  size="xs"
                ></box-icon>
              </div>
            </div>
          </div>
        ))}
      </div>
      {renderPaginationControls()}

      <div id="myModal" className="modal">
        <div className="modal-content">
          <form className="pam-form">
            <label htmlFor="maPam">Mã PAM:</label>
            <input
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
              type="text"
              id="tenPam"
              value={formData.tenPam}
              onChange={handleInputChange}
            />

            <div className="thong-bao-loi">* Tên PAM không được để trống</div>

            <label htmlFor="nguoiTao">Người tạo:</label>
            <input
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
    </div>
  );
}

export default App;
