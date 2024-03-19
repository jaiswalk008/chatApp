import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { chatActions } from "../../Context/store";
import { useState } from "react";

const GroupDetails = () => {
  const [editMode, setEditMode] = useState(false);
  const { currentGroup, currentGroupList } = useSelector(
    (state: any) => state.chat
  );
//   console.log(currentGroup);
  const [groupName, setGroupName] = useState(currentGroup.groupName);
  const currentUserName = localStorage.getItem("username");
  const dispatch = useDispatch();

  const makeAdminHandler = async (id: any) => {
    
    try {
      const res = await axios.patch(
        `http://localhost:5000/makeAdmin?groupId=${currentGroup.groupId}&userId=${id}`
      );
      console.log(res);
      dispatch(chatActions.makeAdmin(id));
    } catch (error) {
      console.log(error);
    }
  };
  let isAdmin = false;
  console.log('current grpip list',currentGroupList)
  currentGroupList.forEach((element: any) => {
    if (element.userName === currentUserName) {
      isAdmin = element.admin;
    }
  });
  const handleEditState = async () => {
    if (editMode) {
      setEditMode((prev) => !prev);
      dispatch(
        chatActions.updateGroupName({
          groupName,
          groupId: currentGroup.groupId,
        })
      );
      await axios.patch(
        "http://localhost:5000/update-groupname?id=" +
          currentGroup.groupId +
          "&groupName=" +
          groupName
      );
    }
    setEditMode((prev) => !prev);
  };
  const removeUser = async (id: string) => {   
    console.log(id);
    await axios.delete(`http://localhost:5000/removeuser?groupId=${currentGroup.groupId}&userId=${id}`)
    dispatch(chatActions.removeUser(id))
  }
  return (
    <div className="group-info">
      <i className="bi bi-people-fill"></i>
      {editMode ? (
        <div className="d-flex">
          <input
            type="text"
            onChange={(e) => setGroupName(e.target.value)}
            value={groupName}
          ></input>
          <button className="btn btn-sm mb-1 ms-1" onClick={handleEditState}>
            ✅
          </button>
        </div>
      ) : (
        <>
          <span>{currentGroup.groupName}</span>
          <i onClick={handleEditState} className="bi bi-pen"></i>
        </>
      )}
      <hr style={{ color: "white" }} />
      <div>
        <p className="group-members text-center mt-2">
          Group members: {currentGroupList.length}
        </p>
        {currentGroupList.map((element: any) => {
         
          return (
            <>
              <li key={element.userName} className="group-members m-3">
                {element.userName}
                <div className="d-flex">
                  {isAdmin && !element.admin ? (
                    <button
                      onClick={() => makeAdminHandler(element.userId)}
                      className="btn btn-danger btn-sm ms-1"
                    >
                      make admin
                    </button>
                  ) : null}

                  {isAdmin && element.userName!==currentUserName ? (
                    <button
                      onClick={() => removeUser(element.userId)}
                      className="btn btn-sm ms-1"
                    >
                      remove user
                    </button>
                  ) : null}
                </div>
              </li>
            </>
          );
        })}
      </div>
    </div>
  );
};
export default GroupDetails;
