import { fetchNWCApis } from '../models/NWC';
import { initialNWCApiView } from '../views/NWCApiView';

const initialNWC = () => {
  const nwcKeys = fetchNWCApis();
  initialNWCApiView(nwcKeys);
};

export default initialNWC;
