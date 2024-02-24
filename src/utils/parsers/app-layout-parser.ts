const APP_BACKGROUND_TYPE_OPTIONS = [
  {
    label: 'Imagem',
    value: 'IMAGE',
  },
  {
    label: 'Cor',
    value: 'COLOR',
  },
];

const APP_MESSAGE_TYPE_OPTIONS = [
  {
    label: 'Alerta',
    value: 'ALERT',
  },
  {
    label: 'Informação',
    value: 'INFO',
  },
  {
    label: 'Boas vindas',
    value: 'WELCOME',
  },
  {
    label: 'Sem mensagem',
    value: 'NONE',
  },
];

export const AppLayoutParser = (data: unknown[]) => {
  const response = data.map((config: any) => {
    const result: any = {};
    const layout = config.layout_storage;

    layout.forEach((data: any) => {
      data.user_id = config.user_id;
      const value = data.value;

      if (data.type === 'BOOLEAN') data.value = value === 'true';
      if (data.type === 'INTEGER') data.value = parseInt(value);

      if (data.type === 'SELECT' && data.name === 'APP_BACKGROUND_TYPE') {
        data.value = {
          options: APP_BACKGROUND_TYPE_OPTIONS,
          selected: value,
        };
      }

      if (data.type === 'SELECT' && data.name === 'APP_MESSAGE_TYPE') {
        data.value = {
          options: APP_MESSAGE_TYPE_OPTIONS,
          selected: value,
        };
      }
    });

    result.app_config = layout;

    if (!config.is_active) {
      result.id = config.id;
      result.user_id = config.user_id;
    }

    return { ...result };
  });

  return response.sort((a: any) => (!a.id ? -1 : 1));
};

export const AppLayoutParserApi = (AppLayout: any) => {
  let APP_BACKGROUND_TYPE = '';
  let APP_BACKGROUND_IMAGE = 0;

  const response = AppLayout.layout_storage.map((AppLayoutStorage: any, index: number) => {
    const value = AppLayoutStorage.value;

    if (AppLayoutStorage.name === 'APP_BACKGROUND_IMAGE') {
      APP_BACKGROUND_IMAGE = index;
    }

    if (AppLayoutStorage.type === 'BOOLEAN') AppLayoutStorage.value = value === 'true';
    if (AppLayoutStorage.type === 'INTEGER') AppLayoutStorage.value = parseInt(value);

    if (AppLayoutStorage.type === 'SELECT' && AppLayoutStorage.name === 'APP_BACKGROUND_TYPE') {
      AppLayoutStorage.value = {
        options: APP_BACKGROUND_TYPE_OPTIONS,
        selected: value,
      };
      APP_BACKGROUND_TYPE = value;
    }

    if (AppLayoutStorage.type === 'SELECT' && AppLayoutStorage.name === 'APP_MESSAGE_TYPE') {
      AppLayoutStorage.value = {
        options: APP_MESSAGE_TYPE_OPTIONS,
        selected: value,
      };
    }

    AppLayoutStorage.user_id = AppLayout.user_id;

    return JSON.stringify({ ...AppLayoutStorage });
  });

  if (APP_BACKGROUND_TYPE === 'COLOR')
    response[APP_BACKGROUND_IMAGE] = JSON.stringify({ ...JSON.parse(response[APP_BACKGROUND_IMAGE]), value: null });

  return response;
};
