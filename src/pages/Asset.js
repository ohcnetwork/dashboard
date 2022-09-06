import React, { lazy, useState, useEffect } from "react";
import { useParams } from "react-router";
import { assetSummary } from "../utils/api";

import AssetInfo from "../components/Asset/AssetInfo";

function Asset() {
  const params = useParams();
  const asset = params.assetId;
  const [assetData, setAssetData] = useState({});
  const [assetLoading, setAssetLoading] = useState(true);

  useEffect(() => {
    assetSummary(asset).then((data) => {
      setAssetData(data);
      setAssetLoading(false);
    });
  }, []);

  return (
    !assetLoading && (
      <div className="h-fulle w-full dark:text-white">
        <AssetInfo assetData={assetData} />
      </div>
    )
  );
}
export default Asset;
