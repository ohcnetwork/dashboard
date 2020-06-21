// name: "Cosmopoliton"
// districtId: 1
// district: "Thiruvananthapuram"
// location: {latitude: 8.5156194, longitude: 76.9355771}
// oxygenCapacity: 4000
// localbody: "Unknown"
// modified: "2020-05-12T15:43:01.859315+05:30"
// capacity:
// 1:
// id: "81b8586d-1a45-4c17-8ea4-70ba6c45bb3b"
// room_type_text: "General Bed"
// modified_date: "2020-05-12T15:43:02.316165+05:30"
// room_type: 1
// total_capacity: 360
// current_capacity: 260

type t = {
  name: string,
  districtId: string,
  district: string,
  oxygenCapacity: int,
  capacity: array(Capacity.t),
};

let decode = json =>
  Json.Decode.{
    name: json |> field("id", string),
    districtId: json |> field("room_type_text", string),
    district: json |> field("modified_date", string),
    oxygenCapacity: json |> field("total_capacity", int),
    capacity: json |> field("capacity", array(Capacity.decode)),
  };
