import genericImage from "../../assets/generic-photo.png";
import { SpaceEntry } from "../model/model";
import './SpaceComponent.css';

interface SpaceComponentProps extends SpaceEntry {
  reserveSpace: (spaceId: string, spaceName: string) => void;
}

export default function SpaceComponent(props: SpaceComponentProps) {
  function renderImage() {
    if (props.photo) {
      return <img src={props.photo}/>;
    } else {
      return <img src={genericImage}/>;
    }
  }

  return (
    <div className="spaceComponent">
      {renderImage()}
      <label className="name">{props.name}</label>
      <br />
      <label className="location">{props.location}</label>
      <br />
      <button onClick={() => props.reserveSpace(props.id, props.name)}>Reserve</button>
    </div>
  );
}
