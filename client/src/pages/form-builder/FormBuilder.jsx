import React from "react";
import { dragIcon, deleteIcon, plusIcon } from "../../assets/svg";

const FormItem = ({ name, type, required }) => {
  return (
    <div
      className="flex p-[17px] justify-between items-center self-stretch
                 rounded-[6px] border border-[#E2E8F0] w-full"
    >
      {/* Form Field Item Left Section */}
      <div className="flex items-center gap-3">
        <div>
          <img src={dragIcon} alt="drag" className="cursor-grab" />
        </div>
        <div className="flex flex-col items-start">
          <div
            className="text-[#020817] text-[15.625px] not-italic font-medium leading-[24px]
"
          >
            {name}
          </div>
          <div
            className="text-[#64748B] text-[13.453px] not-italic font-normal leading-[20px]
"
          >
            Type: {type}{" "}
            <span
              className="text-[#EF4444] text-[13.453px] not-italic font-normal leading-[20px]
"
            >
              {required && "*"}
            </span>{" "}
          </div>
        </div>
      </div>

      {/* Form Field Item Right Section */}
      <button className="flex w-[40px] h-[40px] justify-center items-center rounded-md bg-[#EF4444] hover:bg-[#D92D20] cursor-pointer">
        <img src={deleteIcon} alt="delete" />
      </button>
    </div>
  );
};

const FormBuilder = () => {
  const dummyFormFields = [
    {
      name: "Full Name",
      type: "Text",
      required: true,
    },
    {
      name: "Email",
      type: "Email",
      required: true,
    },
    {
      name: "Phone",
      type: "Tel",
      required: true,
    },
    {
      name: "Company",
      type: "Text",
      required: false,
    },
    {
      name: "Postal Code",
      type: "Text",
      required: false,
    },
  ];


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full h-full p-6 flex flex-col gap-6">
        {/* Heading for Registration Form */}
        <div className="flex flex-col flex-start ">
          <h3 className="text-[#020817]  text-[19.219px] not-italic font-bold leading-[28px]">
            Registration Form Builder
          </h3>
          <p className="text-[#64748B]  text-[15.25px] not-italic font-normal leading-[24px]">
            Customize the registration form for Main Conference 2025
          </p>
        </div>
        {/* All the current form fields */}
        <div className="flex p-[25px] flex-col items-start gap-6 self-stretch rounded-[8px] border-[1px] border-[#E2E8F0] bg-[#FFF] [box-shadow:0px_1px_2px_0px_rgba(0,_0,_0,_0.05)]">
          {/* Form Field Header */}
          <div
            className="text-[#020817] text-[22.313px] not-italic font-semibold leading-[24px] tracking-[-0.6px]
"
          >
            Form Fields
          </div>

          {/* Form Field Body */}
          <div className="flex flex-col flex-start gap-2 align-stretch w-full">
            {/* Form Field Item */}

            {dummyFormFields.map((field, index) => (
              <FormItem key={index} {...field} />
            ))}
          </div>
        </div>
        {/* Add new form field button */}
        <div className="flex flex-col p-[25px] gap-6 self-stretch rounded-lg border border-gray-300 bg-white shadow-sm">
          <div className="text-[#020817] text-[22.313px] font-semibold leading-[24px] tracking-[-0.6px]">
            Add New Field
          </div>
          <div className="flex items-end gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#020817] text-sm font-medium">
                Field Label
              </label>
              <input
                type="text"
                placeholder="e.g., Company Name"
                className="w-[365px] h-10 px-3 py-2.5 rounded-md border border-gray-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[#020817] text-sm font-medium">
                Field Type
              </label>
              <select
                className="w-[230px] h-10 px-3 py-2.5 rounded-md border border-gray-300 appearance-none bg-no-repeat bg-right"
                style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgN0w4IDEwTDExIDciIHN0cm9rZT0iIzY0NzQ4QiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')", backgroundOrigin: "content-box", paddingRight: "2rem" }}
              >
                <option>Text</option>
                <option>Email</option>
                <option>Number</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#020817] text-sm font-medium">Required</span>
              <label className="relative inline-flex items-center">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div>
            <button className="flex h-10 px-4 py-2 justify-center items-center gap-2 rounded-md bg-[#297FFF] hover:bg-[#2570E4] cursor-pointer">
              <img src={plusIcon} alt="plus" />
              <span className="text-white font-medium">Add Field</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
