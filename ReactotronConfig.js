import Reactotron,{trackGlobalErrors} from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron
  .configure({host:"192.168.1.144"})
  .useReactNative()
  .use(reactotronRedux())
  .use(trackGlobalErrors())
  .connect()

export default reactotron
