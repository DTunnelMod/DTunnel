import { ConvertToHexAARRGGBB } from '../convert-color';

const replacePrefix = (data: any[], index = 1) =>
  Object.entries(data).reduce((result: any, [key, value]) => {
    const parts = key.split('_');
    const prefixIndex = Math.min(index, parts.length - 1);
    result[parts.slice(prefixIndex).join('_')] = value;
    return result;
  }, {});

export default function AppConfigParser(config: any) {
  const pickConfig = (keys: any[]) =>
    keys.reduce((picked: any, key: string) => {
      picked[key] = config[key];
      delete config[key];
      return picked;
    }, {});

  config.category.color = ConvertToHexAARRGGBB(config.category.color);
  config.auth = replacePrefix(pickConfig(['auth_password', 'auth_username', 'auth_v2ray_uuid']));
  config.proxy = replacePrefix(pickConfig(['proxy_host', 'proxy_port']));
  config.server = replacePrefix(pickConfig(['server_host', 'server_port']));
  config.dns_server = replacePrefix(pickConfig(['dns_server_dns1', 'dns_server_dns2']), 2);
  config.config_payload = replacePrefix(pickConfig(['config_payload_payload', 'config_payload_sni']), 2);

  if (!config.auth.username) config.auth.username = null;
  if (!config.auth.password) config.auth.password = null;

  if (config.udp_ports)
    config.udp_ports = (config.udp_ports.split(',') || []).map((value: string) => parseInt(value, 10));

  return JSON.stringify(config);
}
