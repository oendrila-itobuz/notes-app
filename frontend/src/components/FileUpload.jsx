import React, { useState, useContext } from "react";
import { MdFileUpload } from "react-icons/md";
import { Modal } from "flowbite-react";
import { GlobalContext } from "../context/GlobalContext";
import { notesInstance } from "../../middleware/AxiosInterceptor";

export default function FileUpload() {
  const [openModal, setOpenModal] = useState(false);
  const { Selectednote, setSelectedNote ,setTriggeredEvent } = useContext(GlobalContext);

  const onFileChange = async (event) => {
    try {
      const data = new FormData();
      data.append('image', event.target.files[0]);
      const res = await notesInstance.post(
        `http://localhost:8000/note/uploadFile/${Selectednote._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setTriggeredEvent(true);
        setSelectedNote(res.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <MdFileUpload size={35} className='cursor-pointer' onClick={() => setOpenModal(true)} />
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Upload Your File</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-sm font-bold text-gray-500 tracking-wide">
              Attach Document
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                {Selectednote.file === "" ? (
                  <div className="h-full w-full text-center flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                      <img
                        className="has-mask h-36 object-center"
                        src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                        alt="freepik image"
                      />
                    </div>
                    <p className="pointer-none text-gray-500">
                      <span className="text-sm">Drag and drop</span> files here
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      name="file"
                      accept="image/png, image/jpeg"
                      onChange={onFileChange}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <img src={Selectednote.file} className="w-40 mx-auto" />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      Upload Again
                    </button>
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      name="file"
                      accept="image/png, image/jpeg"
                      onChange={onFileChange}
                    />
                  </div>
                )}
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-300">
            <span>File type: doc, pdf, types of images</span>
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <button
            type="submit"
            className="my-5 w-full bg-blue-500 text-gray-100 p-4 rounded-full 
              font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg 
              cursor-pointer transition ease-in duration-300"
            onClick={() => setOpenModal(false)}
          >
            Upload
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
