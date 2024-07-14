import Script from "next/script";
import React from "react";

const BuyMeACoffeeWidget = () => {
  return (
    <script
      data-name="BMC-Widget"
      data-cfasync="false"
      src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
      data-id="niklasfischer"
      data-description="Support me on Buy me a coffee!"
      data-message=""
      data-color="#BD5FFF"
      data-position="Right"
      data-x_margin="18"
      data-y_margin="18"
      onLoad={() => console.log("Buy me a coffee widget loaded")}
      onError={() => console.error("Buy me a coffee widget could not be loaded")}
    />
  );
};

export default BuyMeACoffeeWidget;
