type t = {
  id: string,
  roomTypeText: string,
  modifiedDate: string,
  totalCapacity: int,
  currentCapacity: int,
};

let decode = json =>
  Json.Decode.{
    id: json |> field("id", string),
    roomTypeText: json |> field("room_type_text", string),
    modifiedDate: json |> field("modified_date", string),
    totalCapacity: json |> field("total_capacity", int),
    currentCapacity: json |> field("current_capacity", int),
  };
