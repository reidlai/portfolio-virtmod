package cmd

import (
	"fmt"
	"os"
	"strings"

	"github.com/reidlai/ta-workspace/modules/portfolio/go/internal/server"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "portfolio-server",
	Short: "Portfolio module API server",
	Long:  "Portfolio Virtual Module - API for managing portfolio summary",
}

// Execute adds all child commands to the root command and sets flags appropriately.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	// Add subcommands
	rootCmd.AddCommand(apiServerCmd)

	// Persistent flags
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is portfolio.yaml)")
	rootCmd.PersistentFlags().String("log-level", "INFO", "Log level: DEBUG, INFO, WARN, ERROR")
	rootCmd.PersistentFlags().String("log-format", "text", "Log format: json, text")
	rootCmd.PersistentFlags().Bool("debug", false, "Enable debug logging")

	// Bind persistent flags to viper
	_ = viper.BindPFlag("config", rootCmd.PersistentFlags().Lookup("config"))
	_ = viper.BindPFlag("server.log-level", rootCmd.PersistentFlags().Lookup("log-level"))
	_ = viper.BindPFlag("server.log-format", rootCmd.PersistentFlags().Lookup("log-format"))
	_ = viper.BindPFlag("server.debug", rootCmd.PersistentFlags().Lookup("debug"))
}

func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		viper.SetConfigName("portfolio")
		viper.SetConfigType("yaml")
		viper.AddConfigPath(".")
		home, _ := os.UserHomeDir()
		viper.AddConfigPath(home)
	}

	viper.SetEnvPrefix("ta_portfolio")
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_", "-", "_"))
	viper.AutomaticEnv()

	// Global defaults
	viper.SetDefault("server.log-level", "INFO")
	viper.SetDefault("server.log-format", "text")

	if err := viper.ReadInConfig(); err == nil {
		fmt.Println("Using config file:", viper.ConfigFileUsed())
	}
}

// apiServerCmd represents the api-server command
var apiServerCmd = &cobra.Command{
	Use:   "api-server",
	Short: "Manage the portfolio API server",
}

// startCmd represents the start command
var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the portfolio API server",
	RunE: func(cmd *cobra.Command, args []string) error {
		cfg := &server.Config{
			Host:              viper.GetString("api.host"),
			Port:              viper.GetInt("api.port"),
			Debug:             viper.GetBool("server.debug"),
			LogLevel:          viper.GetString("server.log-level"),
			LogFormat:         viper.GetString("server.log-format"),
			ReadHeaderTimeout: viper.GetDuration("api.read-header-timeout"),
			WriteTimeout:      viper.GetDuration("api.write-timeout"),
			IdleTimeout:       viper.GetDuration("api.idle-timeout"),
			MaxHeaderBytes:    viper.GetInt("api.max-header-bytes"),
		}
		return server.Run(cfg)
	},
}

func init() {
	apiServerCmd.AddCommand(startCmd)

	startCmd.Flags().String("host", "localhost", "Server host")
	startCmd.Flags().Int("port", 8000, "Server port")
	startCmd.Flags().String("read-header-timeout", "10s", "Read header timeout")
	startCmd.Flags().String("write-timeout", "60s", "Write timeout")
	startCmd.Flags().String("idle-timeout", "120s", "Idle timeout")
	startCmd.Flags().Int("max-header-bytes", 1<<20, "Max header bytes")

	_ = viper.BindPFlag("api.host", startCmd.Flags().Lookup("host"))
	_ = viper.BindPFlag("api.port", startCmd.Flags().Lookup("port"))
	_ = viper.BindPFlag("api.read-header-timeout", startCmd.Flags().Lookup("read-header-timeout"))
	_ = viper.BindPFlag("api.write-timeout", startCmd.Flags().Lookup("write-timeout"))
	_ = viper.BindPFlag("api.idle-timeout", startCmd.Flags().Lookup("idle-timeout"))
	_ = viper.BindPFlag("api.max-header-bytes", startCmd.Flags().Lookup("max-header-bytes"))

	viper.SetDefault("api.host", "localhost")
	viper.SetDefault("api.port", 8000)
	viper.SetDefault("api.read-header-timeout", "10s")
	viper.SetDefault("api.write-timeout", "60s")
	viper.SetDefault("api.idle-timeout", "120s")
	viper.SetDefault("api.max-header-bytes", 1<<20)
}
