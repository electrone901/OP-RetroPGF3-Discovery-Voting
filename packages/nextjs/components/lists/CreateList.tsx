import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import { useAccount } from "wagmi";
import { useBallot } from "~~/context/BallotContext";
import { notification } from "~~/utils/scaffold-eth";
import { tagsData } from "~~/utils/tags";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Errors {
  listName?: string;
  description?: string;
  impactEvaluation?: string;
}

const CreateList: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [impactEvaluation, setImpactEvaluation] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { address } = useAccount();
  const { state } = useBallot();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  if (!isOpen) {
    return null; // Return null instead of false
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors: Errors = {};

    if (!listName.trim()) {
      newErrors.listName = "List name is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const shareAsList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      // Code to package the ballot as a list
      const listData = {
        name: listName,
        creator: address,
        description,
        impactEvaluation,
        tags,
        projects: state.projects.map(project => ({
          project: project._id,
          allocation: project.allocation,
        })),
      };
      // Save the list to the database
      try {
        const response = await fetch("/api/list", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(listData),
        });
        if (response.ok) {
          // Handle confirmation and navigation
          setIsLoading(false);
          notification.success("List created successfully") && router.push(`/lists/`);
        } else {
          // Handle any errors
          setIsLoading(false);
          notification.error("Error creating list.");
        }
      } catch (e) {
        console.log("ERR_SHARING_LIST::", e);
        setIsLoading(false);
      }
    }
  };

  function handleSelectChange(data: any) {
    const value: any = [];
    data.length &&
      data.map((item: any) => {
        value.push(item.value);
        setTags(value);
      });
  }

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex ">
        <div className="modal-box relative p-8 bg-base-100 w-full max-w-md m-auto flex-col flex">
          <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>
            X
          </span>
          <h3 className="text-center mt-5 text-4xl">Share your vote</h3>
          <p className="text-center mt-4 mb-5">Create a list of the projects in your ballot</p>
          <form onSubmit={shareAsList} className="flex flex-col">
            <input
              className="input input-bordered w-full"
              type="text"
              value={listName}
              maxLength={75}
              onChange={e => setListName(e.target.value)}
              placeholder="List name"
            />
            {errors.listName && <p className="text-red-600 my-1  ml-2 ">{errors.listName}</p>}

            <textarea
              className="textarea textarea-bordered textarea-sm w-full mt-3"
              value={description}
              maxLength={1000}
              onChange={e => setDescription(e.target.value)}
              placeholder="List description"
            />
            {errors.description && <p className="text-red-600 my-1  ml-2 ">{errors.description}</p>}
            <textarea
              className="textarea textarea-bordered textarea-sm w-full mt-3"
              value={impactEvaluation}
              maxLength={1000}
              onChange={e => setImpactEvaluation(e.target.value)}
              placeholder="Describe the impact evolution"
            />
            <div className="form-control w-full mt-3">
              <label className="label p-0">
                <span className="label-text mb-2">Tag list</span>
              </label>
              <CreatableSelect
                className="bg-secondary"
                onChange={handleSelectChange}
                closeMenuOnSelect={false}
                isMulti
                options={tagsData}
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className={`btn btn-primary px-10 rounded-full capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn bg-blue-500 px-10 rounded-full text-white capitalize font-normal font-white flex items-center gap-1 hover:gap-2 transition-all tracking-widest ${
                  isLoading ? "loading " : ""
                }`}
              >
                Share List
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateList;
