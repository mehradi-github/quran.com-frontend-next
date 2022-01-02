import classNames from 'classnames';
import useTranslation from 'next-translate/useTranslation';

import styles from './TafsirView.module.scss';

import DataFetcher from 'src/components/DataFetcher';
import Button, { ButtonSize } from 'src/components/dls/Button/Button';
import Select, { SelectSize } from 'src/components/dls/Forms/Select';
import Skeleton from 'src/components/dls/Skeleton/Skeleton';
import { makeTafsirsUrl } from 'src/utils/apiPaths';
import { getLocaleNameByFullName } from 'src/utils/locale';
import { TafsirsResponse } from 'types/ApiResponses';

type LanguageAndTafsirSelectionProps = {
  selectedTafsirIdOrSlug: number | string;
  onTafsirSelected: (tafsirId: number, tafsirSlug: string) => void;
  selectedLanguage: string;
  onSelectLanguage: (lang: string) => void;
  languageOptions: string[];
};
const LanguageAndTafsirSelection = ({
  selectedTafsirIdOrSlug,
  onTafsirSelected,
  selectedLanguage,
  onSelectLanguage,
  languageOptions,
}: LanguageAndTafsirSelectionProps) => {
  const { lang } = useTranslation();
  return (
    <DataFetcher
      loading={() => (
        <Skeleton
          className={classNames(styles.tafsirSkeletonItem, styles.tafsirSelectionSkeleton)}
        />
      )}
      queryKey={makeTafsirsUrl(lang)}
      render={(data: TafsirsResponse) => {
        if (!data) {
          return (
            <Skeleton
              className={classNames(styles.tafsirSkeletonItem, styles.tafsirSelectionSkeleton)}
            />
          );
        }
        return (
          <div className={styles.tafsirSelectionContainer}>
            <Select
              className={styles.languageSelection}
              size={SelectSize.Small}
              id="lang-selection"
              name="lang-selection"
              options={languageOptions.map((lng) => ({
                label: getLocaleNameByFullName(lng),
                value: lng,
              }))}
              onChange={onSelectLanguage}
              value={selectedLanguage}
            />
            {data.tafsirs
              .filter(
                (tafsir) =>
                  tafsir.languageName === selectedLanguage ||
                  selectedTafsirIdOrSlug === tafsir.slug ||
                  Number(selectedTafsirIdOrSlug) === tafsir.id,
              )
              .map((tafsir) => {
                const selected =
                  selectedTafsirIdOrSlug === tafsir.slug ||
                  Number(selectedTafsirIdOrSlug) === tafsir.id;
                return (
                  <Button
                    onClick={() => onTafsirSelected(tafsir.id, tafsir.slug)}
                    size={ButtonSize.Small}
                    key={tafsir.id}
                    className={classNames(styles.tafsirSelectionItem, {
                      [styles.tafsirItemSelected]: selected,
                    })}
                  >
                    {tafsir.name}
                  </Button>
                );
              })}
          </div>
        );
      }}
    />
  );
};

export default LanguageAndTafsirSelection;