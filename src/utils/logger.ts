import log from "loglevel";

const logger = (log.noConflict() as log.RootLogger).getLogger("ReBACAdmin");

export default logger;
