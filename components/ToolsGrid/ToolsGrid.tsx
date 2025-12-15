import { fetchTools } from "@/lib/api/clientApi";
import ToolCard from "../ToolCard/ToolCard";
import css from "./ToolsGrid.module.css";
import LoadMoreButton from "./LoadMoreBtn/LoadMoreBtn";

// const ToolsGrid = async () => {
//   const tools = await fetchTools();
//   console.log(tools);

//   const handleLoadMore = () => {
//     console.log("LOAD MORE CLICKED ✅");
//   };

//   return (
//     <>
//       <ul className={css.toolsList}>
//         {tools.map((tool) => (
//           <li key={tool._id} className={css.toolsItem}>
//             <ToolCard tool={tool} />
//           </li>
//         ))}
//       </ul>
//       <LoadMoreButton />
//     </>
//   );
// };

// export default ToolsGrid;
import ToolsGridClient from "./ToolsGridClient";

export default function ToolsGrid() {
  return <ToolsGridClient />;
}
