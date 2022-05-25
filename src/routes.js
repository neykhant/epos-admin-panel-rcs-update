import Login from "views/auth/Login";
import Buy from "views/dashboard/buy/Buy";
import Buys from "views/dashboard/buy/Buys";
import Categories from "views/dashboard/category/Categories";
import CategoryImport from "views/dashboard/category/CategoryImport";
import Credit from "views/dashboard/credit/Credit";
import Customers from "views/dashboard/customer/Customers";
import DamageItems from "views/dashboard/damageItem/DamageItems";
import Dashboard from "views/dashboard/Dashboard";
import Delete from "views/dashboard/delete/Delete";
import Expenses from "views/dashboard/expense/Expenses";
import ItemCreate from "views/dashboard/item/ItemCreate";
import ItemImport from "views/dashboard/item/ItemImport";
import Items from "views/dashboard/item/Items";
import ItemTransfers from "views/dashboard/itemTransfer/ItemTransfers";
import LessStocks from "views/dashboard/lessStock/LessStocks";
import Merchants from "views/dashboard/merchant/Merchants";
import MoreSales from "views/dashboard/moreSale/MoreSales";
import PriceImport from "views/dashboard/price/PriceImport";
import Prices from "views/dashboard/price/Prices";
import PriceTracks from "views/dashboard/priceTrack/PriceTracks";
import PrintSale from "views/dashboard/sale/PrintSale";
import Sale from "views/dashboard/sale/Sale";
import SaleCreate from "views/dashboard/sale/SaleCreate";
import Sales from "views/dashboard/sale/Sales";
import SaleReturnItems from "views/dashboard/saleReturn/SaleReturnItems";
import Shops from "views/dashboard/shop/Shops";
import StockImport from "views/dashboard/stock/StockImport";
import Stocks from "views/dashboard/stock/Stocks";
import AllStocks from "views/dashboard/summy/AllStocks";
import Daily from "views/dashboard/summy/Daily";
import GrossProfitByItem from "views/dashboard/summy/GrossProfitByItem";
import Monthly from "views/dashboard/summy/Monthly";
import Profit from "views/dashboard/summy/Profit";
import SaleItems from "views/dashboard/summy/SaleItems";
import Yearly from "views/dashboard/summy/Yearly";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-shop text-primary",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/create-sale/:shopid",
    name: "Create Sale",
    icon: "ni ni-cart text-primary",
    component: SaleCreate,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/login",
    name: "login",
    icon: "fas fa-home text-primary",
    component: Login,
    layout: "/auth",
    invisible: true
  },
  {
    path: "/shops",
    name: "Shops",
    icon: "ni ni-archive-2 text-green",
    component: Shops,
    layout: "/admin"
  },
  {
    path: "/categories",
    name: "Categories",
    icon: "ni ni-single-copy-04 text-pink",
    component: Categories,
    layout: "/admin"
  },
  {
    path: "/items",
    name: "Items",
    icon: "ni ni-collection text-red",
    component: Items,
    layout: "/admin"
  },
  {
    path: "/stocks",
    name: "Stocks",
    icon: "ni ni-map-big text-primary",
    component: Stocks,
    layout: "/admin"
  },
  {
    path: "/all-stocks",
    name: "All Stocks",
    icon: "ni ni-map-big text-primary",
    component: AllStocks,
    layout: "/admin"
  },
  {
    path: "/items/create",
    name: "Create Item",
    component: ItemCreate,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/prices/:shopid/:regionid",
    name: "Prices",
    icon: "ni ni-collection text-red",
    component: Prices,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/customers",
    name: "Customers",
    icon: "ni ni-chart-pie-35 text-info",
    component: Customers,
    layout: "/admin"
  },
  {
    path: "/merchants",
    name: "Merchants",
    icon: "ni ni-chart-pie-35 text-red",
    component: Merchants,
    layout: "/admin"
  },
  {
    path: "/expenses",
    name: "Expenses",
    icon: "ni ni-map-big text-primary",
    component: Expenses,
    layout: "/admin"
  },
  {
    path: "/sales/:shopid",
    name: "Sale",
    icon: "ni ni-collection text-red",
    component: Sale,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/print-sale/:shopid",
    name: "PrintSale",
    icon: "ni ni-collection text-red",
    component: PrintSale,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/sales",
    name: "Sales",
    icon: "ni ni-align-left-2 text-default",
    component: Sales,
    layout: "/admin"
  },
  {
    path: "/credit",
    name: "Sale Credits",
    icon: "ni ni-align-left-2 text-default",
    component: Credit,
    layout: "/admin"
  },
  {
    path: "/purchases/:shopid",
    name: "Purchase",
    icon: "ni ni-align-left-2 text-red",
    component: Buy,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/purchases",
    name: "Purchases",
    icon: "ni ni-align-left-2 text-red",
    component: Buys,
    layout: "/admin"
  },
  {
    path: "/damage-items",
    name: "Damage Items",
    icon: "ni ni-collection text-red",
    component: DamageItems,
    layout: "/admin"
  },
  {
    path: "/sale-return-items",
    name: "Sale Return Items",
    icon: "ni ni-collection text-red",
    component: SaleReturnItems,
    layout: "/admin"
  },
  {
    path: "/daily/:shopid",
    name: "Daily",
    icon: "ni ni-collection text-red",
    component: Daily,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/monthly/:shopid",
    name: "Monthly",
    icon: "ni ni-collection text-red",
    component: Monthly,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/yearly/:shopid",
    name: "Yearly",
    icon: "ni ni-collection text-red",
    component: Yearly,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/profit/:shopid",
    name: "Profit",
    icon: "ni ni-collection text-red",
    component: Profit,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/item-transfers/:shopid",
    name: "ItemTransfers",
    icon: "ni ni-collection text-red",
    component: ItemTransfers,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/price-tracks",
    name: "Price Tracks",
    icon: "ni ni-single-copy-04 text-pink",
    component: PriceTracks,
    layout: "/admin"
  },
  {
    path: "/less-stocks",
    name: "Less Stocks",
    icon: "ni ni-map-big text-primary",
    component: LessStocks,
    layout: "/admin"
  },
  {
    path: "/more-sales/:shopid",
    name: "More Sales",
    icon: "ni ni-map-big text-primary",
    component: MoreSales,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/gross-profit-items/:shopid",
    name: "Gross Profit Items",
    icon: "ni ni-map-big text-primary",
    component: GrossProfitByItem,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/sale-items/:shopid",
    name: "Sale Items",
    icon: "ni ni-map-big text-primary",
    component: SaleItems,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/item-import",
    name: "ItemImport",
    icon: "ni ni-single-copy-04 text-pink",
    component: ItemImport,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/category-import",
    name: "ItemImport",
    icon: "ni ni-single-copy-04 text-pink",
    component: CategoryImport,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/price-import",
    name: "PriceImport",
    icon: "ni ni-single-copy-04 text-pink",
    component: PriceImport,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/stock-import",
    name: "StockImport",
    icon: "ni ni-single-copy-04 text-pink",
    component: StockImport,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/delete-zone",
    name: "Delete Zone",
    icon: "ni ni-single-copy-04 text-red",
    component: Delete,
    layout: "/admin"
  }
  // {
  //   path: "/sales",
  //   name: "Sales",
  //   icon: "ni ni-align-left-2 text-default",
  //   component: Sales,
  //   layout: "/admin",
  // },
];

export default routes;
