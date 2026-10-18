/*
  CredPoint — offer list
  ----------------------
  This is the ONLY file you edit to add, change or remove offers.
  Offers you add here appear on the Explore Offers page automatically,
  and the first three active offers also appear on the Home page.

  Only add offers whose rate and conditions you have confirmed with the
  retailer or affiliate network.

  Fields:
    id          short unique text, lowercase, no spaces        "storename-electronics"
    store       retailer name as it should appear               "Store Name"
    category    short label used for the filter buttons         "Electronics"
    rate        cashback headline                               "Up to 5%"  or  "Flat ₹100"
    summary     one sentence describing the offer
    link        your tracked affiliate link, must start https://
    validTill   last day of the offer "YYYY-MM-DD", or null for no end date
                (offers hide themselves automatically after this date)
    conditions  list of short conditions shown under "Conditions"

  Template — copy it inside the [ ] below, remove the // at the start of
  each line, and separate offers with a comma:

  // {
  //   id: "storename-electronics",
  //   store: "Store Name",
  //   category: "Electronics",
  //   rate: "Up to 5%",
  //   summary: "Cashback on eligible orders placed through CredPoint.",
  //   link: "https://your-affiliate-network-link",
  //   validTill: "2026-12-31",
  //   conditions: [
  //     "Valid for new and existing customers",
  //     "Not valid on gift cards",
  //     "Confirmed after the store's return window ends"
  //   ]
  // }
*/

window.CREDPOINT_OFFERS = [

];
