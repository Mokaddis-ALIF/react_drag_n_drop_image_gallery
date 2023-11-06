import { useRef, useState } from "react";
import "./ImageGallery.css";
import img from "../assets/images/placeholder.png";

export default function ImageGallery({ state, setState }) {
    const dragItem = useRef();
    const dragOverItem = useRef();

    const inputImage = useRef(null);

    const [dragging, setDragging] = useState(null);

    const dragStart = (e, position) => {
        dragItem.current = position;
        setDragging(position);
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const drop = () => {
        const copyListItems = [...state];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setState(copyListItems);

        setDragging(null);
    };

    const checkedHandler = (e, id) => {
        console.log(id);
        const imageIndex = state.findIndex((item) => item.id == id);
        const imageUpdate = state.find((item) => item.id == id);
        const copyListItems = [...state];
        copyListItems[imageIndex] = {
            ...imageUpdate,
            checked: !imageUpdate.checked,
        };
        setState(copyListItems);
    };

    const handlerForImage = (event) => {
        const copyListItems = [...state];
        copyListItems.push({
            id: copyListItems.length + 1,
            url: URL.createObjectURL(event.target.files[0]),
            hover: false,
        });
        setState(copyListItems);
        event.target.files = null;
    };

    return (
        <div className="image-grid">
            {state.map((data, index) => (
                <div
                    className={`main-div ${index == 0 ? "image-grid-col-2 image-grid-row-2" : ""
                        } ${dragging === index ? "dragging" : ""}`}
                    key={index}
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={(e) => dragEnter(e, index)}
                    onDragEnd={drop}
                    draggable={!data.checked}
                    style={{ opacity: data.checked ? 0.6 : 1 }}
                >
                    <label className="container">
                        <input
                            type="checkbox"
                            checked={data.checked}
                            onChange={(e) => checkedHandler(e, data.id)}
                        ></input>
                        <span className="checkmark"></span>
                    </label>

                    <img src={data.url} className="grid-img" />

                    {!data.checked && (
                        <div className="overlay">
                            <div className="text"></div>
                        </div>
                    )}
                </div>
            ))}

            <div>
                <img
                    src={img}
                    className="grid-img"
                    onClick={() => inputImage.current.click()}
                />

                <input
                    type="file"
                    onChange={(e) => handlerForImage(e)}
                    ref={inputImage}
                    style={{ display: "none" }}
                    multiple
                />
            </div>
        </div>
    );
}
